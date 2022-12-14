<script setup lang="ts">
import { nextTick, ref } from 'vue';
import type { Ticket } from "@/types";
import { onClickOutside } from '@/composables/clickOutside';
import { useAutoResetRef } from '@/composables/autoResetRef';
import { useBoardStore } from '@/stores/board';
import { useConfirmation } from '@/stores/confirmation';
import { useToasts } from '@/stores/toasts';
import AppIconButton from "./AppIconButton.vue";
import IconRemove from './icons/IconRemove.vue';
import IconPencil from "./icons/IconPencil.vue";

const props = defineProps<{
    categoryId: string,
    canAddVote: boolean,
    ticket: Ticket
}>();

const boardStore = useBoardStore();
const confirmation = useConfirmation();
const toasts = useToasts();

const ownVoteShaking = useAutoResetRef(false, 820);

const isEditing = ref(false);
const editedText = ref(props.ticket.text);
const textInput = ref(null as null | HTMLTextAreaElement);

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

onClickOutside(textInput, finishEdit, { precondition: () => isEditing.value });

function toggleVote() {
    if (!props.ticket.hasCurrentUserVote) {
        if (props.canAddVote) {
            //TODO: some guard on DB side?
            boardStore.addCurrentUserVote(props.categoryId, props.ticket.id);
        }
        else {
            toasts.show("You have no more votes to spend in this category!");
            ownVoteShaking.value = true;            
        }
    }
    else boardStore.removeCurrentUserVote(props.categoryId, props.ticket.id);
}

function removeTicket() {
    if (props.ticket.hasCurrentUserVote || props.ticket.otherVoteCount > 0) {
        toasts.show("Cannot delete ticket with votes");
        return;
    }
    confirmation.open("Remove ticket?", () => {
        if (props.ticket.hasCurrentUserVote || props.ticket.otherVoteCount > 0) {
            toasts.show("Cannot delete ticket with votes");
        }
        else {
            boardStore.removeTicket(props.categoryId, props.ticket.id);
        }
    });
}

</script>

<template>
    <div class="ticket">
        <div class="ticket__content">
            <template v-if="!isEditing">
                {{ ticket.text }}
            </template>
            <AppIconButton v-if="!isEditing" class="ticket__edit-button" size="small" @click="startEdit">
                <IconPencil />
            </AppIconButton>
            <textarea 
                v-show="isEditing" ref="textInput" v-model="editedText" class="ticket__input" 
                rows="4" @keyup.escape="cancelEdit"
            >
                <!-- @keyup.enter="finishEdit" -->
            </textarea>
            <ul
                class="ticket__vote-zone" :title="ticket.hasCurrentUserVote? 'Click to revoke vote': 'Click to vote'" 
                @click="toggleVote"
            >
                <TransitionGroup name="other-user-vote-transition-">
                    <li v-for="n in ticket.otherVoteCount" :key="ticket.otherVoteCount-n-1" class="ticket__vote" />
                </TransitionGroup>
                <li
                    class="ticket__vote"
                    :class="[ticket.hasCurrentUserVote ? 'ticket__vote--current-yes': 'ticket__vote--current-no', {'ticket__vote--shake': ownVoteShaking}]" 
                />                
            </ul>
        </div>
        <div class="ticket__controls">
            <i class="ticket__remove" @click="removeTicket">
                <IconRemove />
            </i>
        </div>
    </div>
</template>

<style scoped lang="scss">
@use "@/assets/shake";

/* @define ticket */
.ticket {
    border: 1px solid var(--border-color);
    padding: 6px 6px 12px 12px;
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
    flex-wrap: wrap;
    margin-top: 12px;
    padding: 0;
    gap: 5px;
    line-height: 0;
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

@include shake.shake-keyframes(shake2px, 2px);

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

/* @define other-user-vote-transition */
.other-user-vote-transition--enter-active,
.other-user-vote-transition--leave-active {
    transition: all 0.128s ease;
}

.other-user-vote-transition--enter-from,
.other-user-vote-transition--leave-to {
    opacity: 0;
    transform: translateX(-20px);
}
</style>