import { prisma } from "../../data";

export const list = async (ctx) => {
  try {
    const users = await prisma.user.findMany();
    ctx.body = users;
  } catch (error) {
    ctx.status = 500;
    ctx.body = "Something went wrong, try again!";
  }
};

export const create = async (ctx) => {
  try {
    const user = await prisma.user.create({
      data: ctx.request.body,
    });
    ctx.body = user;
  } catch (error) {
    ctx.status = 500;
    ctx.body = "Something went wrong, try again!";
  }
};

export const update = async (ctx) => {
  const { name, email } = ctx.request.body;

  try {
    const user = await prisma.user.update({
      where: { id: ctx.params.id },
      data: { name, email },
    });
    ctx.body = user;
  } catch (error) {
    ctx.status = 500;
    ctx.body = "Something went wrong, try again!";
  }
};

export const remove = async (ctx) => {
  try {
    await prisma.user.delete({
      where: { id: ctx.params.id },
    });
    ctx.body = { id: ctx.params.id };
  } catch (error) {
    ctx.status = 500;
    ctx.body = "Something went wrong, try again!";
  }
};
