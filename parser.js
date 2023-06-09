import { readdirSync, readFileSync, writeFileSync } from "fs";

const dir = `./${process.argv[2]}`;

const filesChapters = readdirSync(dir);
const filesMaps = readdirSync(`${dir}/maps`);

const chapters = [];
const maps = [];

filesChapters.map((file) => {
  if (file.includes("chapter")) {
    const data = JSON.parse(readFileSync(`${dir}/${file}`));
    chapters.push(data);
  }
});

filesMaps.map((file) => {
  const data = JSON.parse(readFileSync(`${dir}/maps/${file}`));
  maps.push(data);
});

const validPointTypes = ["0", "1", "2", "3", "6"];
maps.map((map) => {
  map.points.map((point) => {
    if (validPointTypes.includes(point.type)) {
      const chapter = chapters.find(
        (chapter) => chapter.id === +point.data.chapter
      );

      if (!chapter.points) {
        chapter.points = [];
      }

      chapter.points.push(point);
      writeFileSync(
        `${dir}/chapter_${chapter.id}.json`,
        JSON.stringify(chapter, null, 2)
      );
    }
  });
});

maps.map((map) => {
  const updatedPoints = map.points.filter(
    (point) => !validPointTypes.includes(point.type)
  );

  writeFileSync(
    `${dir}/maps/${filesMaps.filter(
      (fileMap) => fileMap.split("_")[0] === map.id
    )}`,
    JSON.stringify({ ...map, points: updatedPoints }, null, 2)
  );
});
