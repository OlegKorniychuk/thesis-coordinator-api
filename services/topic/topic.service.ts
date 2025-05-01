import {Prisma, Topic, TopicStatus} from '@prisma/client';
import prisma from 'prisma/prisma';

class TopicService {
  public async createTopic(data: Prisma.TopicCreateInput): Promise<Topic> {
    return await prisma.topic.create({data});
  }

  public async getTopicStatus(id: string): Promise<TopicStatus> {
    const res = await prisma.topic.findUniqueOrThrow({
      where: {
        topic_id: id
      },
      select: {
        status: true
      }
    });

    return res.status;
  }

  public async confirmTopic(id: string, refinedTopic?: string): Promise<Topic> {
    const data: Prisma.TopicUpdateInput = {
      status: TopicStatus.confirmed
    };

    if (refinedTopic) {
      data.name = refinedTopic;
    }

    return await prisma.topic.update({
      data,
      where: {topic_id: id}
    });
  }
}

export default new TopicService();
