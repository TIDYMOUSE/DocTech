# TODO:
1. ADD PROPER LOGGING INSTEAD OF CONSOLE.LOG



# NOTES:

### STOMP
1. Clients can use the SEND or SUBSCRIBE commands to send or subscribe for messages, along with a destination header that describes what the message is about and who should receive it. This enables a simple publish-subscribe mechanism that you can use to send messages through the broker to other connected clients or to send messages to the server to request that some work be performed.
2. When you use Spring’s STOMP support, the Spring WebSocket application acts as the STOMP broker to clients. Messages are routed to @Controller message-handling methods or to a simple in-memory broker that keeps track of subscriptions and broadcasts messages to subscribed users. You can also configure Spring to work with a dedicated STOMP broker (such as RabbitMQ, ActiveMQ, and others) for the actual broadcasting of messages. In that case, Spring maintains TCP connections to the broker, relays messages to it, and passes messages from it down to connected WebSocket clients
3. . It is very common, however, for destinations to be path-like strings where /topic/.. implies publish-subscribe (one-to-many) and /queue/ implies point-to-point (one-to-one) message exchanges.
4. Using STOMP as a sub-protocol lets the Spring Framework and Spring Security provide a richer programming model versus using raw WebSockets. The same point can be made about HTTP versus raw TCP and how it lets Spring MVC and other web frameworks provide rich functionality. The following is a list of benefits:

    - Great support for external message brokers and Spring security to secure messages based on STOMP destinations and message types.
    - No need for custom messaging format and protocol.
    - Application logic can be organized in any number of @Controller instances and messages can be routed to them based on the STOMP destination header versus handling raw WebSocket messages with a single WebSocketHandler for a given connection.

5. How it works: 
   - client sends SUBSCRIBE frame with header /topic/greeting. This is sent to clientInboundChannel and then routed to message broker that stores the subscription.
   -  client then sends a SEND frame with header /app/greeting. The app prefix helps it to route to the annotated controller after /app/ with @MessageMapping
   - Value returned from the controller is then send to brokerChannel with header /topic/greeting.
   - The message broker sends the message to all clients subscribed via the clientOutboundChannel
6. Messages from the broker are published to the clientOutboundChannel, from where they are written to WebSocket sessions. As the channel is backed by a ThreadPoolExecutor, messages are processed in different threads, and the resulting sequence received by the client may not match the exact order of publication.

# REMARKS:

1. TEXTWEBSOCKETS: In order to send mqtt inputs to the socket session, the code workaround was to have a map of all sessions and broadcast them. Or else,  use a queue which is basically stomp



Issue: precision and scale attributes only apply to BigDecimal, not Float/Double.
Fix: Use BigDecimal instead of Float for better precision.


@JoinColumn(name = " current tables column name " , referencedColumnName = " column name of the foreign key in its own table ")
@OneToMany ( mappedBy = " actual variable/attribute name in the entity class ")

If mappedBy is not mentioned, a column is created in that table.

