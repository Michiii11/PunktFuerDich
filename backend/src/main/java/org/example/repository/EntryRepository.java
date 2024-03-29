package org.example.repository;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.json.JsonObject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import org.example.model.Entry;
import org.example.socket.EntrySocket;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import io.github.cdimascio.dotenv.Dotenv;

@ApplicationScoped
public class EntryRepository {
    @Inject
    EntityManager em;

    @Inject
    EntrySocket entrySocket;

    @Transactional
    public void increasePoints(String name){
        Entry entry = em.find(Entry.class, name.toUpperCase());
        if(entry == null){
            Entry newEntry = new Entry(name.toUpperCase(), name);
            em.persist(newEntry);
        } else {
            entry.increasePoints();
        }
        entrySocket.broadcast(getAll());
    }

    @Transactional
    public void decreasePoints(String name){
        Entry entry = em.find(Entry.class, name.toUpperCase());
        if(entry != null) {
            entry.decreasePoints();
        }
        entrySocket.broadcast(getAll());
    }

    @Transactional
    public void remove(String name){
        Entry entry = em.find(Entry.class, name);
        em.remove(entry);
        entrySocket.broadcast(getAll());
    }


    public List<Entry> getAll(){
        return em.createQuery("select e from Entry e order by e.points desc", Entry.class).getResultList();
    }

    public boolean isValidPassword(String password) {
        if (password == null || password.isEmpty()) {
            return false;
        }

        /*Dotenv dotenv = Dotenv.configure().load();*/
        /*dotenv.get("USER_PASSWORD")*/

        return Objects.equals(password, "C4xpEOoV+1rqoJpJi3vGfaIAo8kYhg2tw0I3ir/tOrs=");
    }

    public static String hashString(String input) {
        if(input == null) return null;

        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hashedBytes = digest.digest(input.getBytes());

            // Convert the byte array to a Base64 encoded string
            String base64Hash = Base64.getEncoder().encodeToString(hashedBytes);

            return base64Hash;
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
            return null;
        }
    }
}
