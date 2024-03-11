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

    @GET
    @Path("increase/{name}")
    public void increase(@PathParam("name")String name) {
        repository.increasePoints(name);
    }

    @GET
    @Path("decrease/{name}")
    public void decrease(@PathParam("name")String name){
        repository.decreasePoints(name);
    }

    @GET
    @Path("isvalidpassword/{password}")
    public boolean isValidPassword(@PathParam("password")String password){
        return repository.isValidPassword(password);
    }

    @GET
    @Path("getall")
    public List<Entry> getAll(){
        return repository.getAll();
    }
}
