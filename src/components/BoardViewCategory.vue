<script setup lang="ts">
import { computed } from "vue";
import type { Category } from "@/types";
import { useBoardStore } from '@/stores/board';
import { useConfirmation } from '@/stores/confirmation';
import { useToasts } from "@/stores/toasts";
import BoardViewCategoryAddTicket from './BoardViewCategoryAddTicket.vue';
import AppVerticalScroll from './AppVerticalScroll.vue';
import BoardViewCategoryTicket from "./BoardViewCategoryTicket.vue";
import BoardViewCategoryName from './BoardViewCategoryName.vue';
import IconRemove from './icons/IconRemove.vue';
import AppIconButton from './AppIconButton.vue';

const props = defineProps<{
    category: Category
}>();

const boardStore = useBoardStore();
const confirmation = useConfirmation();
const toasts = useToasts();

function addTicket(text: string) {
    boardStore.addTicket(props.category.id, text);
}

function removeCategory() {
    confirmation.open("Remove category?", () => {
        if (props.category.tickets.length == 0) {
            boardStore.removeCategory(props.category.id);
        }
        else {
            toasts.show("Oops, this category already has tickets! Cannot delete!");
        }
    });
}

const unusedVotesTip = computed(() => {
    const count = props.category.unusedCurrentUserVotes;
    if (count == 0) return 'No votes left to spend';
    if (count == 1) return 'You can spend one more vote';
    return `You can spend ${count} more votes`;
});

</script>

<template>
    <div class="category">
        <div class="category__header">
            <BoardViewCategoryName :category="category" class="category__name" />
            <div class="category__actions">
                <ul v-if="category.tickets.length > 0" class="category__unused-votes" :title="unusedVotesTip">
                    <TransitionGroup name="unused-vote-transition-">
                        <li v-for="n in category.unusedCurrentUserVotes" :key="n" class="category__unused-vote" />
                    </TransitionGroup>
                </ul>
                <AppIconButton v-else class="category__remove" @click="removeCategory">
                    <IconRemove />
                </AppIconButton>
            </div>
        </div>
        <div class="category__content">
            <AppVerticalScroll>
                <ul class="category__tickets ticket-list">
                    <TransitionGroup name="ticket-transition-">
                        <li v-for="ticket of category.tickets" :key="ticket.id" class="ticket-list__item">
                            <BoardViewCategoryTicket
                                :category-id="category.id" :can-add-vote="category.unusedCurrentUserVotes > 0" :ticket="ticket"
                            />
                        </li>
                    </TransitionGroup>
                </ul>
                <BoardViewCategoryAddTicket class="category__add-ticket" @add="(text)=>addTicket(text)" />
            </AppVerticalScroll>
        </div>
    </div>
</template>

<style scoped lang="scss">
/* @define unused-vote-transition */
.unused-vote-transition--enter-active,
.unused-vote-transition--leave-active {
    transition: all 0.128s ease;
}

.unused-vote-transition--enter-from,
.unused-vote-transition--leave-to {
    opacity: 0;
    transform: translateY(-20px);
}

/* @define ticket-transition */
.ticket-transition--leave-active {
    transition: all 0.25s ease;
}

.ticket-transition--leave-to {
    opacity: 0.5;
    transform: translateX(-100%);
}

.ticket-transition--enter-active {
    transition: all 0.25s ease;
}

.ticket-transition--enter-from {
    opacity: 0;
    transform: translateY(100%);
}

/* @define category */
.category {
    width: 240px;
    display: flex;
    flex-direction: column;
    height: 100%;
}

.category__header {
    border: 1px solid var(--border-color);
    background-color: var(--surface-accent);
    margin-bottom: calc(var(--spacing-bigger) - var(--spacing-for-outline));
    padding: 2px 8px;
    font-weight: 700;
    margin-left: var(--spacing-for-outline);
    margin-right: var(--spacing-for-outline);
    display: flex;
    align-items: center;
    height: 42px;
    gap: 6px;
    flex-shrink: 0;
}

.category__name {
    flex-grow: 1;
    min-width: 0;
}

.category__actions {
    margin-left: auto;
    flex: none;
    width: 32px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
}

.category__unused-votes {
    list-style: none;
    padding: 0;
    display: flex;
    flex-direction: row-reverse;
    gap: 5px;
}

.category__unused-vote::after {
    content: "";
    width: var(--vote-point-size);
    height: var(--vote-point-size);
    display: inline-block;
    background-color: var(--brand);
    border-radius: calc(var(--vote-point-size) / 2);
}

.category__content {
    flex-grow: 1;
    overflow-y: hidden;
}

.category__tickets {
    margin-left: var(--spacing-for-outline);
    margin-right: var(--spacing-for-outline);
}

.category__add-ticket {
    margin-left: var(--spacing-for-outline);
    margin-right: var(--spacing-for-outline);
    margin-top: var(--spacing-for-outline);
}

/* @define ticket-list */
.ticket-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    padding: 0;
}

.ticket-list__item {
    margin-bottom: var(--spacing-normal);

    &:first-child {
        margin-top: var(--spacing-for-outline);
    }

    &:last-child {
        margin-bottom: calc(var(--spacing-normal) - var(--spacing-for-outline));
    }
}
</style>