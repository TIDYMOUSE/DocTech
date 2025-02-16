package com.example.DocTech.Controller;

import com.example.DocTech.Service.MQTTService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/mqtt")
public class MQTTController {

    private final MQTTService mqttService;

    MQTTController(MQTTService mqttService) {
        this.mqttService = mqttService;
    }


//    @GetMapping("/publish")
//    public String publishMessage(@RequestParam String message, @RequestParam String topic){
//        mqttService.sentToMqtt(message, topic);
//        return "Message published: "+ message + " on topic: " + topic;
//    }
}
