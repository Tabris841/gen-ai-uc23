import { faker } from '@faker-js/faker';

import './App.css';

const AGE_CERTIFICATION = [
  'G',
  'PG',
  'PG-13',
  'R',
  'NC-17',
  'U',
  'U/A',
  'A',
  'S',
  'AL',
  '6',
  '9',
  '12',
  '12A',
  '15',
  '18',
  '18R',
  'R18',
  'R21',
  'M',
  'MA15+',
  'R16',
  'R18+',
  'X18',
  'T',
  'E',
  'E10+',
  'EC',
  'C',
  'CA',
  'GP',
  'M/PG',
  'TV-Y',
  'TV-Y7',
  'TV-G',
  'TV-PG',
  'TV-14',
  'TV-MA',
];
const GENRES = [
  'Action',
  'Adventure',
  'Comedy',
  'Drama',
  'Fantasy',
  'Horror',
  'Mystery',
  'Romance',
  'Thriller',
  'Western',
  'Sci-Fi',
  'Biography',
  'History',
];
const ROLES = [
  'Director',
  'Producer',
  'Screenwriter',
  'Actor',
  'Actress',
  'Cinematographer',
  'Film Editor',
  'Production Designer',
  'Costume Designer',
  'Music Composer',
];

function App() {
  function getRandomElement(collection) {
    const randomIndex = Math.floor(Math.random() * collection.length);
    return collection[randomIndex];
  }

  function getRandomNumberInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function generateData() {
    const titles = [...Array(100)].map((_, i) => ({
      id: i + 1,
      title: faker.lorem.words(3),
      description: faker.lorem.sentences(3),
      release_year: faker.date
        .between({ from: '1900-01-01', to: new Date() })
        .getFullYear(),
      age_certification: getRandomElement(AGE_CERTIFICATION),
      runtime: getRandomNumberInRange(80, 200),
      genres: [...Array(getRandomNumberInRange(1, 3))].map(() =>
        getRandomElement(GENRES)
      ),
      production_country: faker.location.countryCode(),
      seasons: Math.random() > 0.7 ? getRandomNumberInRange(1, 10) : null,
    }));

    const credits = titles.flatMap((title) =>
      [...Array(getRandomNumberInRange(5, 10))].map((_, i) => ({
        id: i + 1 + title.id * 10,
        title_id: title.id,
        real_name: faker.person.fullName(),
        character_name: faker.person.fullName(),
        role: getRandomElement(ROLES),
      }))
    );

    console.log({ titles, credits });

    return { titles, credits };
  }

  function arrayToCSV(data) {
    const csvRows = [];
    const headers = Object.keys(data[0]);
    csvRows.push(headers.join(','));

    for (const row of data) {
      const values = headers.map((header) => {
        const escaped = ('' + row[header]).replace(/"/g, '\\"');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(','));
    }

    return csvRows.join('\n').concat('\n\n');
  }

  function generateAndDownloadData() {
    const { credits, titles } = generateData();

    const csvTitlesData = arrayToCSV(titles);
    const csvCreditsData = arrayToCSV(credits);
    const blob = new Blob([csvTitlesData, csvCreditsData], {
      type: 'text/csv',
    });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.download = 'titles.csv';
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="App">
      <button onClick={generateAndDownloadData}>
        Perform synthetic data generation
      </button>
    </div>
  );
}

export default App;
