import * as courseRepository from "../data/course.js";

export async function getCourse(req, res) {
  const data = await courseRepository.getAll();
  res.setHeader("Content-Type", "application/json");

  // const filtered = data.filter((item)=> {
  //   return item.author === name;
  // })

  res.status(200).json(data);
}

export async function getCourse(req, res) {
  const id = req.params.id;
  const course = await courseRepository.getById(id);
  console.log("getCourse");
  if (course) {
    res.status(200).json(course);
  } else {
    res.status(404).json({ message: `Post ${id} not found` });
  }
}

export async function courseCreate(req, res, next) {
  const { author, subject, code, text, reply, like } = req.body;
  const body = { author, subject, code, text, reply, like };
  const course = await courseRepository.create(body, req.userId);
  res.status(201).json(course);
}

export async function updateCourse(req, res, next) {
  const id = req.params.id;
  const { author, subject, code, text, like } = req.body;
  const body = { author, subject, code, text, like };
  // const update = await courseRepository.update(id, body);
  const course = await courseRepository.getById(id);
  if (!course) {
    return res.sendStatus(404);
  }
  if (course.userId !== req.userId) {
    return res.sendStatus(403);
  }
  const updated = await courseRepository.update(id, body);
  res.status(200).json(updated);

  // if(update){
  //   res.status(200).json(update);
  // }
  // else{
  //   res.status(500).json({message: `Update failed. course ${id} not found`});
  // }
}

export async function deleteCourse(req, res) {
  const id = req.params.id;
  const course = await courseRepository.getById(id);
  // const course= await courseRepository.discard(id);
  if (!course) {
    return res.sendStatus(404);
  }
  if (course.userId !== req.userId) {
    return res.sendStatus(403);
  }
  await courseRepository.discard(id);
  res.sendStatus(204);
  // if(courseGetId.userId !== req.userId){
  //   return res.sendStatus(403);
  // }
  // if(courseGetId){
  //   await courseRepository.discard(id);
  //   res.status(200).json(course);
  // }
  // else{
  //   res.status(404).json({message: 'No document deleted'});
  // }
}
