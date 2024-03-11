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
    public void addPoints(String name){
        Entry entry = em.find(Entry.class, name.toUpperCase());

        if(entry == null){
            Entry newEntry = new Entry(name.toUpperCase());
            em.persist(newEntry);
        } else {
            entry.increasePoints();
        }

        entrySocket.broadcast(getAll());
    }

    public List<Entry> getAll(){
        return em.createQuery("select e from Entry e", Entry.class).getResultList();
    }
}
