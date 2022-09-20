import { useBoardStore } from "@/stores/board";
import { useToasts } from "@/stores/toasts";
import type { Ticket } from "@/types";
import { createTestingPinia } from "@pinia/testing";
import { mount } from "@vue/test-utils";
import BoardViewCategoryTicket from "../BoardViewCategoryTicket.vue";

interface Props {
    categoryId: string,
    canAddVote: boolean,
    ticket: Ticket
}
function mountIt(props: Props) {
    const pinia = createTestingPinia();
    return mount(BoardViewCategoryTicket, {
        props,
        global: { plugins: [pinia] }
    });
}

describe("The ticket component", () => {
    it("displays users' votes", () => {
        const wrapper = mountIt({
            categoryId: "c1", canAddVote: true, ticket: {
                id: "T1",
                text: "text 1",
                hasCurrentUserVote: true,
                otherVoteCount: 3
            }
        });
        expect(wrapper.findAll(".ticket__vote").length).toBe(4);
        expect(wrapper.findAll(".ticket__vote--current-yes").length).toBe(1);
        expect(wrapper.get(".ticket__vote-zone").attributes()["title"]).toBe("Click to revoke vote");
    });

    it("prompts the user to vote", () => {
        const wrapper = mountIt({
            categoryId: "c1", canAddVote: true, ticket: {
                id: "T1",
                text: "text 1",
                hasCurrentUserVote: false,
                otherVoteCount: 3
            }
        });
        expect(wrapper.findAll(".ticket__vote").length).toBe(4);
        expect(wrapper.findAll(".ticket__vote--current-no").length).toBe(1);
        expect(wrapper.get(".ticket__vote-zone").attributes()["title"]).toBe("Click to vote");
    });

    it("prompts the user to vote even if he doesn't have spare votes", () => {
        const wrapper = mountIt({
            categoryId: "c1", canAddVote: false, ticket: {
                id: "T1",
                text: "text 1",
                hasCurrentUserVote: false,
                otherVoteCount: 3
            }
        });
        expect(wrapper.findAll(".ticket__vote").length).toBe(4);
        expect(wrapper.findAll(".ticket__vote--current-no").length).toBe(1);
        expect(wrapper.get(".ticket__vote-zone").attributes()["title"]).toBe("Click to vote");
    });

    it("removes user's vote on vote zone click", async () => {
        const wrapper = mountIt({
            categoryId: "c1", canAddVote: true, ticket: {
                id: "T1",
                text: "text 1",
                hasCurrentUserVote: true,
                otherVoteCount: 3
            }
        });
        const boardStore = useBoardStore();
        await wrapper.get(".ticket__vote-zone").trigger("click");
        expect(boardStore.removeCurrentUserVote).toHaveBeenCalledOnce();
        expect(boardStore.removeCurrentUserVote).toHaveBeenCalledWith("c1", "T1");
    });

    it("adds user's vote on vote zone click if user has free voices", async () => {
        const wrapper = mountIt({
            categoryId: "c1", canAddVote: true, ticket: {
                id: "T1",
                text: "text 1",
                hasCurrentUserVote: false,
                otherVoteCount: 3
            }
        });
        const boardStore = useBoardStore();
        await wrapper.get(".ticket__vote-zone").trigger("click");
        expect(boardStore.addCurrentUserVote).toHaveBeenCalledOnce();
        expect(boardStore.addCurrentUserVote).toHaveBeenCalledWith("c1", "T1");
    });

    it("doesn't add user's vote on vote zone click if user has no free voices; shakes and shows toast", async () => {
        const wrapper = mountIt({
            categoryId: "c1", canAddVote: false, ticket: {
                id: "T1",
                text: "text 1",
                hasCurrentUserVote: false,
                otherVoteCount: 3
            }
        });
        const boardStore = useBoardStore();
        const toasts = useToasts();
        await wrapper.get(".ticket__vote-zone").trigger("click");
        expect(boardStore.addCurrentUserVote).not.toHaveBeenCalled();
        expect(toasts.show).toHaveBeenCalledOnce();
        expect(wrapper.get(".ticket__vote--current-no").classes()).toContain("ticket__vote--shake");
        expect(toasts.show).toHaveBeenCalledWith("You have no more votes to spend in this category!");
    });
});