function Adopciones(year, gender) {
    this.year = year;
    this.gender = gender;
}

// URL del archivo JSON
const url = 'datos/adopciones.json';
let all_adopciones = [];

// Obtener los datos del archivo JSON
fetch(url)
  .then(response => response.json())
  .then(data => {
    // Convertir los datos en objetos Adopciones
    all_adopciones = data.map(item => new Adopciones(item.year, item.gender));
  })
  .catch(error => console.error('Error al obtener los datos:', error));
