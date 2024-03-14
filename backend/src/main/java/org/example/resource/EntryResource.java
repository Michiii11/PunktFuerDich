package org.example.resource;

import jakarta.inject.Inject;
import jakarta.json.Json;
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

    @POST
    @Path("increase")
    @Consumes(MediaType.APPLICATION_JSON)
    public void increase(JsonObject data) {
        repository.increasePoints(data.getString("name"));
    }

    @POST
    @Path("decrease")
    @Consumes(MediaType.APPLICATION_JSON)
    public void decrease(JsonObject data){
        repository.decreasePoints(data.getString("name"));
    }

    @POST
    @Path("remove")
    @Consumes(MediaType.APPLICATION_JSON)
    public void remove(JsonObject data){
        repository.remove(data.getString("name"));
    }

    @POST
    @Path("isvalidpassword")
    @Consumes(MediaType.APPLICATION_JSON)
    public boolean isValidPassword(JsonObject password){
        return repository.isValidPassword(password.getString("password"));
    }

    @GET
    @Path("getall")
    public List<Entry> getAll(){
        return repository.getAll();
    }
}
