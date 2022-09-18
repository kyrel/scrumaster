<script setup lang="ts">
import { useBoardStore } from '@/stores/board';
import { useScruConfirmation } from '@/stores/scruConfirmation';
import { useToasts } from '@/stores/toasts';
import { ref } from 'vue';
import IconRemove from '../components/icons/IconRemove.vue';
import type { Ticket } from "../types";

const props = defineProps<{
    categoryId: string,
    canAddVote: boolean,
    ticket: Ticket
}>()

const boardStore = useBoardStore();
const scruConfirmation = useScruConfirmation();
const toasts = useToasts();

const ownVoteShaking = ref(false);

function toggleVote(ticket: Ticket) {
    if (!ticket.hasCurrentUserVote) {
        if (props.canAddVote) {
            //TODO: some guard on DB side?
            boardStore.addCurrentUserVote(props.categoryId, ticket.id)
        }
        else {
            toasts.warning("You have no more votes to spend in this category!");
            if (!ownVoteShaking.value) {
                ownVoteShaking.value = true;
                setTimeout(() => ownVoteShaking.value = false, 820);
            }
        }
    }
    else boardStore.removeCurrentUserVote(props.categoryId, ticket.id)
}

function removeTicket(ticket: Ticket) {
    if (ticket.hasCurrentUserVote || ticket.otherVoteCount > 0) {
        toasts.warning("Cannot delete ticket with votes");
        return;
    }
    scruConfirmation.open("Remove ticket?", () => {
        boardStore.removeTicket(props.categoryId, ticket.id);
    })
}

</script>

<template>
    <div class="ticket">
        <i class="ticket__remove" @click="removeTicket(ticket)">
            <IconRemove />
        </i>
        {{ ticket.text }}
        <ul class="ticket__vote-zone" @click="toggleVote(ticket)">
            <li v-for="n in ticket.otherVoteCount" :key="n" class="ticket__vote"></li>
            <li class="ticket__vote"
                :class="[ticket.hasCurrentUserVote ? 'ticket__vote--current-yes': 'ticket__vote--current-no', {'ticket__vote--shake': ownVoteShaking}]">
            </li>
        </ul>
    </div>
</template>

<style scoped lang="scss">
@use "@/assets/shake";

/* @define ticket */
.ticket {
    border: 1px solid var(--surface1);
    padding: 6px 24px 6px 8px;
    position: relative;
}

.ticket__remove {
    position: absolute;
    top: 6px;
    right: 6px;
    display: none;
    opacity: 0.4;
    cursor: pointer;

    &:hover {
        opacity: 1;
    }

    &:active {
        transform: translate(1px, 1px);
    }

    .ticket:hover & {
        display: inline-block;
    }

    @media (hover: none) {
        display: inline-block;
    }
}

.ticket__vote-zone {
    cursor: pointer;
    list-style: none;
    display: flex;
    margin: 0;
    padding: 0;
    gap: 5px;
}

.ticket__vote::after {
    content: "";
    width: var(--vote-point-size);
    height: var(--vote-point-size);
    display: inline-block;
    border: 1px solid var(--text2);
    background-color: var(--text2);
    opacity: 0.5;
    border-radius: calc(var(--vote-point-size) / 2);
}

.ticket__vote--current-yes::after {
    border-color: var(--brand);
    background-color: var(--brand);
    border-width: 3px;
    opacity: 1;
}

.ticket__vote--current-no::after {
    border-color: var(--brand);
    background-color: transparent;
    border-width: 3px;
    opacity: 1;
}

.ticket__vote--current-no {
    visibility: hidden;
}

.ticket__vote--shake {
    @include shake.shake(shake2px);
}

@include shake.shake-keyframes(shake2px, 2px);

.ticket:hover .ticket__vote--current-no,
.ticket__vote--current-no.shake {
    visibility: visible;
}
</style>