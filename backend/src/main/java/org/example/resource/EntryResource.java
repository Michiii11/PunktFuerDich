package org.example.resource;

import jakarta.inject.Inject;
import jakarta.json.JsonObject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
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

    @POST
    @Path("isvalidpassword")
    @Consumes(MediaType.APPLICATION_JSON)
    public boolean isValidPassword(JsonObject password){
        return repository.isValidPassword(password);
    }

    @GET
    @Path("getall")
    public List<Entry> getAll(){
        return repository.getAll();
    }
}
