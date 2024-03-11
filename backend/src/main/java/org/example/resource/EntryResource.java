package org.example.resource;

import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import org.example.model.Entry;
import org.example.repository.EntryRepository;

import java.util.List;

@Path("api/entry")
public class EntryResource {
    @Inject
    EntryRepository repository;

    @POST
    @Path("addpoints/{name}")
    public void addPoints(@PathParam("name")String name) {
        repository.addPoints(name);
    }

    @GET
    @Path("getall")
    public List<Entry> getAll(){
        return repository.getAll();
    }
}
