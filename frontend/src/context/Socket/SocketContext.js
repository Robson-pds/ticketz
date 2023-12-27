import { createContext } from "react";
import openSocket from "socket.io-client";

const socketManager = {
	currentCompanyId: -1,
	currentUserId: -1,
	currentSocket: null,

	GetSocket: function(companyId) {
		let userId = null;
		if (localStorage.getItem("userId")) {
			userId = localStorage.getItem("userId");
		}

		if (companyId !== this.currentCompanyId || userId !== this.currentUserId) {
			if (this.currentSocket) {
				this.currentSocket.disconnect();
			}

			this.currentCompanyId = companyId;
			this.currentUserId = userId;
			this.currentSocket = openSocket(process.env.REACT_APP_BACKEND_URL, {
				transports: ["websocket"],
				pingTimeout: 18000,
				pingInterval: 18000,
				query: companyId ? { companyId, userId } : { userId },
			});
			
			this.currentSocket.onAny((event, ...args) => {
				console.log("Event: ", event, "\nArg[0] ", args[0]);
			});
		}
		
		return this.currentSocket;
	},
	
	onConnect: function( callbackConnect ) {
		if (this.currentSocket.connected) {
			callbackConnect();
		}
		this.currentSocket.on("connect", callbackConnect);
	},
};

const SocketContext = createContext()

export { SocketContext, socketManager };
