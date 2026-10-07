// Municipis de l'Alt Penedès (coordenades aproximades del nucli)
export const TOWNS = [
  { id: 'vilafranca', name: 'Vilafranca del Penedès', lat: 41.3465, lng: 1.699 },
  { id: 'sant-sadurni', name: "Sant Sadurní d'Anoia", lat: 41.426, lng: 1.785 },
  { id: 'gelida', name: 'Gelida', lat: 41.438, lng: 1.865 },
  { id: 'sant-marti-sarroca', name: 'Sant Martí Sarroca', lat: 41.387, lng: 1.611 },
  { id: 'torrelles-foix', name: 'Torrelles de Foix', lat: 41.396, lng: 1.578 },
  { id: 'pontons', name: 'Pontons', lat: 41.414, lng: 1.513 },
  { id: 'mediona', name: 'Mediona', lat: 41.478, lng: 1.611 },
  { id: 'olerdola', name: 'Olèrdola', lat: 41.306, lng: 1.73 },
  { id: 'monjos', name: 'Santa Margarida i els Monjos', lat: 41.323, lng: 1.662 },
  { id: 'subirats', name: 'Subirats', lat: 41.409, lng: 1.808 },
  { id: 'la-granada', name: 'La Granada', lat: 41.378, lng: 1.719 },
  { id: 'les-cabanyes', name: 'Les Cabanyes', lat: 41.372, lng: 1.688 },
  { id: 'pacs', name: 'Pacs del Penedès', lat: 41.36, lng: 1.672 },
  { id: 'avinyonet', name: 'Avinyonet del Penedès', lat: 41.364, lng: 1.775 },
  { id: 'castellvi-marca', name: 'Castellví de la Marca', lat: 41.33, lng: 1.62 },
  { id: 'font-rubi', name: 'Font-rubí', lat: 41.42, lng: 1.62 },
  { id: 'sant-pere-riudebitlles', name: 'Sant Pere de Riudebitlles', lat: 41.452, lng: 1.702 },
  { id: 'torrelavit', name: 'Torrelavit', lat: 41.443, lng: 1.731 },
  { id: 'sant-quinti', name: 'Sant Quintí de Mediona', lat: 41.463, lng: 1.668 },
  { id: 'sant-llorenc-hortons', name: "Sant Llorenç d'Hortons", lat: 41.472, lng: 1.824 },
  { id: 'castellet-gornal', name: 'Castellet i la Gornal', lat: 41.257, lng: 1.638 },
  { id: 'sant-cugat-sesgarrigues', name: 'Sant Cugat Sesgarrigues', lat: 41.365, lng: 1.752 },
  { id: 'olesa-bonesvalls', name: 'Olesa de Bonesvalls', lat: 41.355, lng: 1.846 },
].sort((a, b) => a.name.localeCompare(b.name, 'ca'))

export const townById = (id) => TOWNS.find((t) => t.id === id)

// Centre de la comarca, per quan no sabem on és l'usuari
export const COMARCA_CENTER = [41.385, 1.69]
