    package com.example.DocTech.Websocket;


    import com.example.DocTech.Service.MQTTService;
    import com.example.DocTech.Util.CSVREADER;
    import org.springframework.context.event.EventListener;
    import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
    import org.springframework.stereotype.Component;
    import org.springframework.web.socket.messaging.SessionConnectedEvent;
    import org.springframework.web.socket.messaging.SessionDisconnectEvent;

    @Component
    public class STOMPEventListener {

        private final MQTTService mqttService;

        STOMPEventListener(MQTTService mqttService) {
            this.mqttService = mqttService;
        }

        @EventListener
        public void handleSTOMPConnectListener(SessionConnectedEvent event) {
            StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
            String sessionId = headerAccessor.getSessionId();
            System.out.println("STOMP CONNECTED: " + sessionId);

            mqttService.startListening();
            // TODO: THINK ON THIS

        }


        @EventListener
        public void handleSTOMPDisconnectListener(SessionDisconnectEvent event) {
            StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
            String sessionId = headerAccessor.getSessionId();

            System.out.println("STOMP DISCONNECT: " + sessionId);

            mqttService.stopListening();
        }




    }
