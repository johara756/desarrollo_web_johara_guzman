package tarea4.tarea4.controllers;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import tarea4.tarea4.models.Avistamiento;
import tarea4.tarea4.services.ApiService;

@RestController
public class ApiController {

    private final ApiService apiService;

    public ApiController(ApiService apiService) {
        this.apiService = apiService;
    }

    @GetMapping("/buscar-avistamientos/{texto}")
    public Map<String, Object> buscarAvistamientos(
            @PathVariable("texto") String texto) {

        List<Avistamiento> resultados =
                apiService.buscarAvistamientos(texto);

        List<Map<String, Object>> datos =
                new ArrayList<Map<String, Object>>();

        for (Avistamiento avistamiento : resultados) {

            Map<String, Object> dato =
                    new HashMap<String, Object>();

            dato.put("id", avistamiento.getId());

            dato.put(
                    "voluntario",
                    avistamiento.getVoluntario().getNombre()
            );

            dato.put(
                    "fechaHora",
                    avistamiento.getFechaHora()
            );

            dato.put(
                    "ave",
                    avistamiento.getAve().getNombre()
            );

            dato.put(
                    "comuna",
                    avistamiento.getVoluntario()
                            .getComuna()
                            .getNombre()
            );

            dato.put(
                    "promedio",
                    apiService.obtenerPromedio(
                            avistamiento.getId()
                    )
            );

            datos.add(dato);
        }

        Map<String, Object> respuesta =
                new HashMap<String, Object>();

        respuesta.put("data", datos);

        return respuesta;
    }

    @PostMapping("/evaluar/{avistamientoId}")
    public Map<String, Object> evaluarAvistamiento(
            @PathVariable("avistamientoId") Integer avistamientoId,
            @RequestBody Map<String, Integer> datos) {

        Integer nota = datos.get("nota");

        Double promedio =
                apiService.agregarNota(
                        avistamientoId,
                        nota
                );

        Map<String, Object> respuesta =
                new HashMap<String, Object>();

        respuesta.put("promedio", promedio);

        return respuesta;
    }
}