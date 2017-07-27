import { genUuid } from '../utils/helpers';
import store from '../stores/configureStore';
import socket from 'socket.io-client';

this.state = store.getState().chatStore;
console.log(this.state);

export default {
    initChat(data){
        var messages = data.chat.messages.map((message) => {
            message.id = genUuid();
            return message;
        });

        this.state.messages.empty();
        this.state.messages.push.apply(this.props.messages, messages);  
    },

    newMessage(message) {
        message.id = genUuid();
        this.state.messages.push(message);
    },

    toggleChatUserList(){
        this.state.showUserList = !this.state.showUserLit;
        store.dispatch('TOGGLE_CHAT_USERLIST', this.state);
    },
    sendMessage(text) {
        this.state.waitingForServer = true;
        socket.emit('new_message', { text: text}, function(err) {
            if(err) {
                alert('Chat error', + err);
            }
        });
    }
}