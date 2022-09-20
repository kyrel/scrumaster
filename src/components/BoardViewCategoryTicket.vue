<script setup lang="ts">
import { nextTick, ref } from 'vue';
import type { Ticket } from "@/types";
import { useClickOutside } from '@/composables/clickOutside';
import { useAutoResetRef } from '@/composables/autoResetRef';
import { useBoardStore } from '@/stores/board';
import { useScruConfirmation } from '@/stores/scruConfirmation';
import { useToasts } from '@/stores/toasts';
import AppIconButton from "./AppIconButton.vue";
import IconRemove from './icons/IconRemove.vue';
import IconPencil from "./icons/IconPencil.vue";

const props = defineProps<{
    categoryId: string,
    canAddVote: boolean,
    ticket: Ticket
}>()

const boardStore = useBoardStore();
const scruConfirmation = useScruConfirmation();
const toasts = useToasts();

const ownVoteShaking = useAutoResetRef(false, 820);

const isEditing = ref(false);
const editedText = ref(props.ticket.text);
const textInput = ref(null as null | HTMLTextAreaElement)

function startEdit() {
    editedText.value = props.ticket.text;
    isEditing.value = true;
    nextTick(() => { textInput.value!.focus(); });
}

function cancelEdit() {
    editedText.value = props.ticket.text;
    isEditing.value = false;
}

function finishEdit() {
    if (editedText.value) boardStore.editTicket(props.categoryId, props.ticket.id, editedText.value);
    else editedText.value = props.ticket.text;
    isEditing.value = false;
}

useClickOutside(textInput, finishEdit, { precondition: () => isEditing.value })

function toggleVote(ticket: Ticket) {
    if (!ticket.hasCurrentUserVote) {
        if (props.canAddVote) {
            //TODO: some guard on DB side?
            boardStore.addCurrentUserVote(props.categoryId, ticket.id)
        }
        else {
            toasts.warning("You have no more votes to spend in this category!");
            ownVoteShaking.value = true;            
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
        <div class="ticket__content">
            <template v-if="!isEditing">{{ ticket.text }}</template>
            <AppIconButton size="small" @click="startEdit" v-if="!isEditing" class="ticket__edit-button">
                <IconPencil />
            </AppIconButton>
            <textarea class="ticket__input" v-model="editedText" v-show="isEditing" rows="4" ref="textInput"
                @keyup.escape="cancelEdit">
                <!-- @keyup.enter="finishEdit" -->
            </textarea>
            <ul class="ticket__vote-zone" @click="toggleVote(ticket)"
                :title="ticket.hasCurrentUserVote? 'Click to revoke vote': 'Click to vote'">
                <li v-for="n in ticket.otherVoteCount" :key="n" class="ticket__vote"></li>
                <li class="ticket__vote"
                    :class="[ticket.hasCurrentUserVote ? 'ticket__vote--current-yes': 'ticket__vote--current-no', {'ticket__vote--shake': ownVoteShaking}]">
                </li>
            </ul>
        </div>
        <div class="ticket__controls">
            <i class="ticket__remove" @click="removeTicket(ticket)">
                <IconRemove />
            </i>
        </div>
    </div>
</template>

<style scoped lang="scss">
@use "@/assets/shake";

/* @define ticket */
.ticket {
    border: 1px solid var(--surface1);
    padding: 6px 6px 6px 12px;
    display: flex;
    flex-direction: row;
    gap: 4px;
}

.ticket__content {
    flex-grow: 1;
}

.ticket__input {
    width: 100%;
    resize: none;
}

.ticket__controls {
    width: 18px;
}

.ticket__remove {
    visibility: hidden;
    opacity: 0.4;
    cursor: pointer;

    &:hover {
        opacity: 1;
    }

    &:active {
        transform: translate(1px, 1px);
    }

    .ticket:hover & {
        visibility: visible;
    }

    @media (hover: none) {
        visibility: visible;
    }

    @media (pointer: coarse) {
        visibility: visible;
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
    transition: background-color 0.25s;
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
    border-width: 1px;
    border-style: dashed;
    opacity: 1;
}

.ticket__vote--current-no {
    visibility: hidden;

    /* TODO: decide whether we need this or not */
    @media (hover: none) {
        visibility: visible;
    }

    @media (pointer: coarse) {
        visibility: visible;
    }

    .ticket:hover & {
        visibility: visible;
    }
}

.ticket__vote--shake {
    @include shake.shake(shake2px);

    visibility: visible;
}

.ticket__edit-button {
    margin-left: 4px;
    visibility: hidden;

    .ticket__content:hover & {
        visibility: visible;
    }

    @media (hover: none) {
        visibility: visible;
    }

    @media (pointer: coarse) {
        visibility: visible;
    }
}

@include shake.shake-keyframes(shake2px, 2px);
</style>