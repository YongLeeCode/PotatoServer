import bcrypt from 'bcrypt';
import {} from 'express-async-errors';
import * as userRepository from '../data/auth.js';
import { config } from '../config.js';
import createJwtToken from './jwtGenerator.js';
import * as nodeMailer from '../middleware/node-mailer.js';

let number;
export async function signup (req, res, next) {
  // console.log(req);
  // console.log(req.body);
  const { username, password, name, email, country } = req.body;
  const found = await userRepository.findByUsername(username);
  if (found) {
    return res.status(409).json({ message: `${username} already exists` });
  }
  // console.log('123');
  const hashed = await bcrypt.hash(password, config.bcrypt.saltRounds);
  const userId = await userRepository.createUser({
    username,
    password: hashed,
    name,
    email,
    country,
    level: 2
  });
  const token = createJwtToken(userId);
  res.status(201).json({ token, username });
}

export async function login(req, res){
  const {email, password} = req.body;
  const user = await userRepository.findByEmail(email);
  if(!user){
    return res.status(401).json({message: 'Invalid user or password'});
  }
  const isValidPassword = await bcrypt.compare(password, user.password);
  if(!isValidPassword){
    return res.status(401).json({message: 'Invalid user or password'});
  }

  const token = createJwtToken(user.id);
  const username = user.username
  res.status(200).json({token, username});
}

export async function me(req, res, next) {
  // console.log(asdf);
  const user = await userRepository.findById(req.userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.status(200).json({ token: req.token, username: user.username, userId: user.id });
}

export async function email(req, res, next) {
  const email = req.body.email
  console.log(`${email} line56`);
  const found = await userRepository.findByEmail(email);
  if (found) {
    return res.status(409).json({ message: `${email} already exists` });
  }
  number = nodeMailer.generateRandom(111111, 999999);
  nodeMailer.sendEmail(number, email);
  setTimeout(() => {
    number = undefined;
  }, 300000);
  return res.status(200).json({message: `Verification code sent`});
}
export async function check(req, res, next) {
  const code = req.params.code;
  if (number == code){
    return res.status(200).json({message: "Code matched"});
  }
  else{
    return res.status(401).json({message: `Code is not matched`});
  }
}