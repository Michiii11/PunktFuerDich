package org.example.resource;

import jakarta.inject.Inject;
import jakarta.json.Json;
import jakarta.json.JsonObject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
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
    public Response increase(JsonObject data) {
        if(repository.isValidPassword(data.getString("password"))){
            repository.increasePoints(data.getString("name"));
            return Response.ok().build();
        } else{
            return Response.status(204, "Password not valid").build();
        }
    }

    @POST
    @Path("decrease")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response decrease(JsonObject data){
        if(repository.isValidPassword(data.getString("password"))){
            repository.decreasePoints(data.getString("name"));
            return Response.ok().build();
        } else{
            return Response.status(204, "Password not valid").build();
        }
    }

    @POST
    @Path("remove")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response remove(JsonObject data){
        if(repository.isValidPassword(data.getString("password"))){
            repository.remove(data.getString("name"));
            return Response.ok().build();
        } else{
            return Response.status(204, "Password not valid").build();
        }
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
