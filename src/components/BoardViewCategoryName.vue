<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue';
import type { Category } from "@/types";
import { onClickOutside } from '@/composables/clickOutside';
import { useBoardStore } from '@/stores/board';
import IconPencil from './icons/IconPencil.vue';
import AppIconButton from './AppIconButton.vue';

const props = defineProps<{
    category: Category
}>();

const boardStore = useBoardStore();

const isEditingCategoryName = ref(false);
const editedCategoryName = ref(props.category.name);
const categoryNameInput = ref(null as null | HTMLInputElement);

function startCategoryNameEdit() {
    editedCategoryName.value = props.category.name;
    isEditingCategoryName.value = true;
    nextTick(() => { categoryNameInput.value!.focus(); });
}

function cancelCategoryNameEdit() {
    editedCategoryName.value = props.category.name;
    isEditingCategoryName.value = false;
}

function finishCategoryNameEdit() {
    if (editedCategoryName.value) boardStore.renameCategory(props.category.id, editedCategoryName.value);
    else editedCategoryName.value = props.category.name;
    isEditingCategoryName.value = false;
}

onMounted(async () => {
    if (props.category.id == boardStore.awaitingCategoryToEditId) {
        setTimeout(() => {
            startCategoryNameEdit();
            boardStore.stopWaitingForCategoryToEdit();
        }, 0);
    }
});

onClickOutside(categoryNameInput, finishCategoryNameEdit, { precondition: () => isEditingCategoryName.value });

</script>

<template>
    <div class="category-name">
        <div v-if="!isEditingCategoryName" class="category-name__display" :title="category.name">
            {{ category.name }}
        </div>
        <AppIconButton v-if="!isEditingCategoryName" class="category-name__edit-button" @click="startCategoryNameEdit">
            <IconPencil />
        </AppIconButton>
        <input
            v-show="isEditingCategoryName" ref="categoryNameInput" v-model="editedCategoryName"
            class="category-name__input" type="text" maxlength="32"
            @keyup.enter="finishCategoryNameEdit" @keyup.escape="cancelCategoryNameEdit"
        >
    </div>
</template>

<style scoped lang="scss">
/* @define category-name */
.category-name {
    display: flex;
    flex-direction: row;
}

.category-name__display {
    margin-left: 4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.category-name__input {
    padding: 4px 8px;
    flex-grow: 1;
    flex-shrink: 1;
    min-width: 0;
}

.category-name__edit-button {
    margin-left: 6px;
    display: none;

    .category-name:hover & {
        display: inline-block;
    }

    @media (hover: none) {
        display: inline-block;
    }

    @media (pointer: coarse) {
        display: inline-block;
    }
}
</style>