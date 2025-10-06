document.addEventListener("DOMContentLoaded", () => {
  console.log("[v0] Jefe de Área page loaded")


  function getUsuarios() {
    const usuarios = localStorage.getItem("usuarios")
    return usuarios ? JSON.parse(usuarios) : []
  }

  function getTareas() {
    const tareas = localStorage.getItem("tareas")
    return tareas ? JSON.parse(tareas) : []
  }

  function saveTareas(tareas) {
    localStorage.setItem("tareas", JSON.stringify(tareas))
  }

  function cargarEmpleados() {
    const usuarios = getUsuarios()
    const selectEmpleado = document.getElementById("selectEmpleado")

    selectEmpleado.innerHTML = '<option value="">Seleccionar empleado</option>'

    usuarios.forEach((usuario) => {
      const cargoCode = (usuario.cargo || "").toString().toUpperCase()
      if (cargoCode === "EMP" || cargoCode === "ING") {
        const option = document.createElement("option")
        option.value = usuario.idEmpleado
        option.textContent = `${usuario.nombre} (${usuario.idEmpleado})`
        selectEmpleado.appendChild(option)
      }
    })

    console.log("[v0] Loaded employees into dropdown")
  }

  document.getElementById("btnMostrarEmpleados").addEventListener("click", () => {
    const usuarios = getUsuarios()
    const container = document.getElementById("empleadosContainer")

    if (usuarios.length === 0) {
      container.innerHTML = '<p class="info-message">No hay empleados registrados.</p>'
      return
    }

    let html = '<div class="empleados-list">'
    usuarios.forEach((usuario) => {
      html += `
        <div class="empleado-card">
          <h3>${usuario.nombre}</h3>
          <p><strong>ID:</strong> ${usuario.idEmpleado}</p>
          <p><strong>Cargo:</strong> ${usuario.cargo}</p>
          <p><strong>Email:</strong> ${usuario.email}</p>
        </div>
      `
    })
    html += "</div>"

    container.innerHTML = html
    console.log("[v0] Displayed employees:", usuarios.length)
  })

  document.getElementById("btnRepartir").addEventListener("click", () => {
    const descripcion = document.getElementById("inputTareaDescripcion").value.trim()
    const empleadoId = document.getElementById("selectEmpleado").value
    const mensajeDiv = document.getElementById("mensajeAsignacion")

    console.log("[v0] Assigning task:", { descripcion, empleadoId })

    if (!descripcion) {
      mensajeDiv.innerHTML = '<p class="error-message">Por favor ingrese una descripción de la tarea.</p>'
      return
    }

    if (!empleadoId) {
      mensajeDiv.innerHTML = '<p class="error-message">Por favor seleccione un empleado.</p>'
      return
    }

    const usuarios = getUsuarios()
    const empleado = usuarios.find((u) => u.idEmpleado === empleadoId)

    if (!empleado) {
      mensajeDiv.innerHTML = '<p class="error-message">Empleado no encontrado.</p>'
      return
    }

    const tareas = getTareas()
    const nuevaTarea = {
      id: Date.now(),
      descripcion: descripcion,
      asignadaA: empleadoId,
      nombreEmpleado: empleado.nombre,
      estado: "Pendiente",
      fechaAsignacion: new Date().toISOString(),
    }

    tareas.push(nuevaTarea)
    saveTareas(tareas)

    console.log("[v0] Task assigned successfully:", nuevaTarea)

    mensajeDiv.innerHTML = `<p class="success-message">✓ Tarea "${descripcion}" asignada a ${empleado.nombre}</p>`

    document.getElementById("inputTareaDescripcion").value = ""
    document.getElementById("selectEmpleado").value = ""

    setTimeout(() => {
      mensajeDiv.innerHTML = ""
    }, 3000)
  })

  document.getElementById("btnVerificar").addEventListener("click", () => {
    const empleadoId = document.getElementById("inputEmpleadoId").value.trim()
    const container = document.getElementById("tareasContainer")

    console.log("[v0] Verifying tasks for:", empleadoId)

    if (!empleadoId) {
      container.innerHTML = '<p class="error-message">Por favor ingrese el ID del empleado.</p>'
      return
    }

    const usuarios = getUsuarios()
    let empleado = usuarios.find((u) => u.idEmpleado === empleadoId)
    if (!empleado) {
      empleado = usuarios.find((u) => u.nombre.toLowerCase() === empleadoId.toLowerCase())
    }

    if (!empleado) {
      container.innerHTML = '<p class="error-message">Empleado no encontrado.</p>'
      return
    }

    const todasLasTareas = getTareas()
    const tareasEmpleado = todasLasTareas.filter((t) => t.asignadaA === empleado.idEmpleado)

    console.log("[v0] Found tasks for", empleado.nombre, ":", tareasEmpleado)

    if (tareasEmpleado.length === 0) {
      container.innerHTML = `<p class="info-message">No hay tareas asignadas a ${empleado.nombre}.</p>`
      return
    }

    const completadas = tareasEmpleado.filter((t) => t.estado === "Completada").length
    const pendientes = tareasEmpleado.filter((t) => t.estado === "Pendiente").length

    let html = `<div class="tareas-empleado">`
    html += `<h3>📋 Tareas de ${empleado.nombre}</h3>`

    tareasEmpleado.forEach((tarea) => {
      const estadoClass = tarea.estado === "Completada" ? "completada" : "pendiente"
      html += `
        <div class="tarea-item ${estadoClass}">
          <div class="tarea-descripcion">${tarea.descripcion}</div>
          <div class="tarea-estado">Estado: <strong>${tarea.estado}</strong></div>
        </div>
      `
    })

    html += `
      <div class="tareas-resumen">
        <p>✅ Completadas: <strong>${completadas}</strong></p>
        <p>⏳ Pendientes: <strong>${pendientes}</strong></p>
      </div>
    `
    html += "</div>"

    container.innerHTML = html
  })

  cargarEmpleados()
})
