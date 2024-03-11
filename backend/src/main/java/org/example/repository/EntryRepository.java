package org.example.repository;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import org.example.model.Entry;
import org.example.socket.EntrySocket;

import java.util.List;

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

    public List<Entry> getAll(){
        return em.createQuery("select e from Entry e order by e.points desc", Entry.class).getResultList();
    }
}
