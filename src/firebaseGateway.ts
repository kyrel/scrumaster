import { initializeApp } from "firebase/app";
import { getAuth, isSignInWithEmailLink, onAuthStateChanged as fireOnAuthStateChanged, sendSignInLinkToEmail, signInWithEmailLink, signOut as fireSignOut } from "firebase/auth";
import { getDatabase, onValue, push, ref, set, update } from "firebase/database";
import type { User, Category, Ticket } from "./types";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
    apiKey: "AIzaSyBJqXnmL7FXYQ9A8O1uLqWob8XbW_eZJUM",
    authDomain: "voorhoede-assignment.firebaseapp.com",
    projectId: "voorhoede-assignment",
    storageBucket: "voorhoede-assignment.appspot.com",
    messagingSenderId: "508237203877",
    appId: "1:508237203877:web:d658aefc49625bdd05c04c"
};

export const firebaseApp = initializeApp(firebaseConfig);

const auth = getAuth();

function onAuthStateChanged(callback: (user: User | null) => void) {
    fireOnAuthStateChanged(auth, (user) => {
        callback(user ? { uid: user.uid, email: user.email } : null);
    });
}

async function sendAuthLink(email: string) {
    const actionCodeSettings = {
        url: import.meta.env.VITE_ROOT_URL + 'signupconfirm',
        handleCodeInApp: true
        // iOS: { bundleId: 'com.example.ios' },
        // android: { packageName: 'com.example.android', installApp: true, minimumVersion: '12' },
        // dynamicLinkDomain: 'example.page.link'
    };
    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
}

function isAuthLink(link: string) {
    return isSignInWithEmailLink(auth, link);
}

function signIn(email: string, link: string) {
    return signInWithEmailLink(auth, email, link);
}

function signOut() {
    return fireSignOut(auth);
}

const db = getDatabase(firebaseApp, "https://voorhoede-assignment-default-rtdb.europe-west1.firebasedatabase.app/");

function addCategory(name: string) {
    const categories = ref(db, "categories");
    const newCategory = push(categories);
    set(newCategory, { name });
    return newCategory.key!;
}

function renameCategory(id: string, name: string) {
    const dbCategory = ref(db, `categories/${id}`);
    update(dbCategory, { name });
}

function removeCategory(categoryId: string) {
    const dbCategory = ref(db, `categories/${categoryId}`);
    set(dbCategory, null);
}

function addTicket(categoryId: string, text: string) {
    const categoryTickets = ref(db, `categories/${categoryId}/tickets`);
    const newTicket = push(categoryTickets);
    set(newTicket, { text });
}

function editTicket(categoryId: string, ticketId: string, text: string) {
    const dbTicket = ref(db, `categories/${categoryId}/tickets/${ticketId}`);
    update(dbTicket, { text });
}

function removeTicket(categoryId: string, ticketId: string) {
    const dbTicket = ref(db, `categories/${categoryId}/tickets/${ticketId}`);
    set(dbTicket, null);
}

function addUserVote(categoryId: string, ticketId: string, userUid: string) {
    const userVoteRef = ref(db, `categories/${categoryId}/tickets/${ticketId}/votes/${userUid}`);
    set(userVoteRef, true);
}

function removeUserVote(categoryId: string, ticketId: string, userUid: string) {
    const userVoteRef = ref(db, `categories/${categoryId}/tickets/${ticketId}/votes/${userUid}`);
    set(userVoteRef, null);
}

function onBoardChange(userUidGetter: () => string | null, callback: (board: Category[]) => void) {
    onValue(ref(db, "categories"), snapshot => {
        const currentUserId = userUidGetter();
        const board = [] as Category[];
        snapshot.forEach(dbCategory => {
            const tickets = [] as Ticket[];
            let currentUserVotes = 0;
            dbCategory.child("tickets").forEach(dbTicket => {
                const ticketVal = dbTicket.val();
                const ticket: Ticket = {
                    id: dbTicket.key!,
                    text: ticketVal.text,
                    hasCurrentUserVote: false,
                    otherVoteCount: 0
                };
                dbTicket.child("votes").forEach(dbVote => {
                    if (dbVote.key == currentUserId) {
                        ticket.hasCurrentUserVote = true;
                        currentUserVotes++;
                    }
                    else ticket.otherVoteCount++;
                });
                tickets.push(ticket);
            });

            const categoryVal = dbCategory.val();
            const category: Category = {
                id: dbCategory.key!,
                name: categoryVal.name, //TODO: an easier-on-eye mapping method                
                tickets,
                unusedCurrentUserVotes: currentUserVotes > 2 ? 0 : 2 - currentUserVotes
            };
            board.push(category);
        });
        callback(board);
    });
}

export default {
    onAuthStateChanged, sendAuthLink, isAuthLink, signIn, signOut,
    addCategory, renameCategory, removeCategory, addTicket, editTicket, removeTicket, addUserVote, removeUserVote, onBoardChange
};