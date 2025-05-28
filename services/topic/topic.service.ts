import {Prisma, Topic, TopicStatus} from '@prisma/client';
import prisma from 'prisma/prisma';

class TopicService {
  public async createTopic(data: Prisma.TopicUncheckedCreateInput): Promise<Topic> {
    const {name, comment, bachelor_id} = data;
    return await prisma.topic.upsert({
      where: {
        bachelor_id: bachelor_id
      },
      update: {
        name: name,
        comment: comment,
        status: TopicStatus.pending
      },
      create: {
        bachelor_id: bachelor_id,
        name: name,
        comment: comment
      }
    });
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

  public async countUnconfirmedTopics(diplomaCycleId: string): Promise<number> {
    return await prisma.topic.count({
      where: {
        status: {
          not: TopicStatus.confirmed
        },
        bachelor: {
          user: {
            diploma_cycle_id: {
              equals: diplomaCycleId
            }
          }
        }
      }
    });
  }

  public async updateTopicStatus(
    id: string,
    status: TopicStatus,
    comment?: string
  ): Promise<Topic> {
    const updateData: Prisma.TopicUpdateInput = {status: status};

    if (comment) updateData.comment = comment;

    return await prisma.topic.update({
      data: updateData,
      where: {
        topic_id: id
      }
    });
  }
}

export default new TopicService();
