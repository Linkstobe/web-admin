type Font = {
  name: string
};

type Fontlist = Font[];

export function handleGetAvailableFontsList(): Fontlist {
  const fonts = [
    'Roboto', 'Roboto Serif', 'Bebas Neue', 'Amatic', 'Great Vibes', 'Concert One', 'Patua One', 'Zeyada',
    'Courgette', 'Russo One', 'Silkscreen', 'Gloria Hallelujah', 'Pacifico', 'Open Sans', 'Lato', 'Montserrat',
    'Poppins', 'Raleway', 'Raleway Dots', 'Merriweather', 'Nunito', 'Oswald', 'Source Sans Pro', 'PT Sans',
    'Lora', 'Roboto Slab', 'Ubuntu', 'Playfair Display', 'Crimson Text', 'Libre Baskerville', 'Slabo 27px',
    'Noto Sans', 'Rubik', 'Rubik Mono One'
  ];

  return fonts.map(font => ({ name: font }));
}
