<script setup lang="ts">
import { useBoardStore } from '@/stores/board';
import ScruAddTicket from '../components/ScruAddTicket.vue';
import ScruVerticalScroll from './ScruVerticalScroll.vue';
import type { Category } from "../types";
import TicketPartialView from "./TicketPartialView.vue";

const props = defineProps<{
    category: Category
}>()

const boardStore = useBoardStore();

function addTicket(text: string) {
    boardStore.addTicket(props.category.id, text)
}

</script>

<template>
    <div class="category">
        <div class="category__header">
            <div class="category__name">{{ category.name }}</div>
            <ul class="category__unused-votes">
                <TransitionGroup name="unused-vote-transition-">
                    <li v-for="n in category.unusedCurrentUserVotes" :key="n"
                        class="ticket__vote ticket__vote--current-yes"></li>
                </TransitionGroup>
            </ul>
        </div>
        <div class="category__content">
            <ScruVerticalScroll>
                <ul class="category__tickets ticket-list">
                    <TransitionGroup name="ticket-transition-">
                        <li v-for="ticket of category.tickets" :key="ticket.id" class="ticket-list__item">
                            <TicketPartialView :category-id="category.id"
                                :can-add-vote="category.unusedCurrentUserVotes > 0" :ticket="ticket" />
                        </li>
                    </TransitionGroup>
                </ul>
                <ScruAddTicket class="category__add-ticket" @add="(text)=>addTicket(text)" />
            </ScruVerticalScroll>
        </div>
    </div>
</template>

<style scoped>
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
    border: 1px solid var(--surface4);
    background-color: var(--surface3);
    margin-bottom: 18px;
    padding: 6px 8px;
    font-weight: 700;
    margin-left: 4px;
    margin-right: 4px;
    display: flex;
}

.category__unused-votes {
    list-style: none;
    padding: none;
    margin-left: auto;
    display: flex;
    flex-direction: row-reverse;
    gap: 5px;
}

.category__content {
    flex-grow: 1;
    overflow-y: hidden;
}

.category__tickets {
    margin-left: 4px;
    margin-right: 4px;
}

.category__add-ticket {
    margin-left: 4px;
    margin-right: 4px;
    margin-top: 2px;
}

/* @define ticket-list */
.ticket-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    padding: 0;
}

.ticket-list__item {
    margin-bottom: 12px;
}

.ticket-list__item:first-child {
    margin-top: 2px;
}

.ticket-list__item:last-child {
    margin-bottom: 10px;
}

.ticket__vote::after {
    content: '';
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
</style>