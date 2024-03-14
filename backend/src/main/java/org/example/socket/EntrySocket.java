package org.example.socket;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.websocket.OnClose;
import jakarta.websocket.OnOpen;
import jakarta.websocket.Session;
import jakarta.websocket.server.ServerEndpoint;
import org.example.model.Entry;
import org.example.repository.EntryRepository;

import java.util.ArrayList;
import java.util.List;

@ServerEndpoint("/socket/entry")
@ApplicationScoped
public class EntrySocket {
    List<Session> sessions = new ArrayList<>();

    @Inject
    ObjectMapper objectMapper;

    @OnOpen
    public void onOpen(Session session) {
        System.out.println("Socket opened: " + session);
        sessions.add(session);
    }

    @OnClose
    public void onClose(Session session) {
        System.out.println("Socket closed: " + session);
        sessions.remove(session);
    }

    public void broadcast(List<Entry> response) {
        String responseString = "";
        try{
            responseString = objectMapper.writeValueAsString(response);
        }catch (JsonProcessingException ex){
            responseString = "ewow";
        }

        String finalResponseString = responseString;
        sessions.forEach(s -> {
            s.getAsyncRemote().sendObject(finalResponseString, result -> {
                if (result.getException() != null){
                    System.out.println("Unable to send message: " + result.getException());
                }
            });
        });
    }
}
