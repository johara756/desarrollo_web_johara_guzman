package tarea4.tarea4.services;

import java.util.ArrayList;
import java.util.List;
import java.text.Normalizer;

import org.springframework.stereotype.Service;

import tarea4.tarea4.models.Avistamiento;
import tarea4.tarea4.models.AvistamientoRepository;
import tarea4.tarea4.models.Nota;
import tarea4.tarea4.models.NotaRepository;

@Service
public class ApiService {

    private final AvistamientoRepository avistamientoRepository;
    private final NotaRepository notaRepository;

    public ApiService(
            AvistamientoRepository avistamientoRepository,
            NotaRepository notaRepository) {

        this.avistamientoRepository = avistamientoRepository;
        this.notaRepository = notaRepository;
    }

    public List<Avistamiento> buscarAvistamientos(String texto) {

        List<Avistamiento> avistamientos = avistamientoRepository.findAll();
        List<Avistamiento> resultados = new ArrayList<Avistamiento>();

        String textoBusqueda = texto.toLowerCase();

        for (Avistamiento avistamiento : avistamientos) {

            String nombreAve =
                    avistamiento.getAve().getNombre().toLowerCase();

            String nombreVoluntario =
                    avistamiento.getVoluntario().getNombre().toLowerCase();

            String nombreComuna =
                    avistamiento.getVoluntario()
                            .getComuna()
                            .getNombre()
                            .toLowerCase();

            if (nombreAve.contains(textoBusqueda)
                    || nombreVoluntario.contains(textoBusqueda)
                    || nombreComuna.contains(textoBusqueda)) {

                resultados.add(avistamiento);
            }
        }

        return resultados;
    }

    public Double obtenerPromedio(Integer avistamientoId) {

        List<Nota> notas =
                notaRepository.findByAvistamientoId(avistamientoId);

        if (notas.isEmpty()) {
            return null;
        }

        double suma = 0;

        for (Nota nota : notas) {
            suma += nota.getNota();
        }

        return suma / notas.size();
    }

    public Double agregarNota(Integer avistamientoId, Integer valorNota) {

        if (valorNota== null || valorNota < 1 || valorNota > 7) {
            throw new IllegalArgumentException(
                    "La nota debe estar entre 1 y 7"
            );
        }

        Avistamiento avistamiento =
                avistamientoRepository.findById(avistamientoId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Avistamiento no encontrado"
                                )
                        );

        Nota nuevaNota = new Nota(avistamiento, valorNota);

        notaRepository.save(nuevaNota);

        return obtenerPromedio(avistamientoId);
    }
}

private String normalizarTexto(String texto) {

    return Normalizer.normalize(
            texto.toLowerCase(),
            Normalizer.Form.NFD
        )
        .replaceAll("\\p{M}", "");
}