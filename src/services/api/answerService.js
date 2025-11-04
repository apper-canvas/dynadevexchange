import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";

class AnswerService {
  constructor() {
    this.tableName = "answer_c";
  }

  async getAll() {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords(this.tableName, {
        fields: [
          {"field": {"Name": "body_c"}},
          {"field": {"Name": "author_id_c"}},
          {"field": {"Name": "author_name_c"}},
          {"field": {"Name": "author_reputation_c"}},
          {"field": {"Name": "question_id_c"}},
          {"field": {"Name": "votes_c"}},
          {"field": {"Name": "is_accepted_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "updated_at_c"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data.map(answer => ({
        Id: answer.Id,
        body: answer.body_c || '',
        authorId: answer.author_id_c || '',
        authorName: answer.author_name_c || '',
        authorReputation: answer.author_reputation_c || 1,
        questionId: answer.question_id_c || null,
        votes: answer.votes_c || 0,
        isAccepted: answer.is_accepted_c || false,
        createdAt: answer.created_at_c || new Date().toISOString(),
        updatedAt: answer.updated_at_c || new Date().toISOString()
      }));
    } catch (error) {
      console.error("Error fetching answers:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getById(id) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.getRecordById(this.tableName, id, {
        fields: [
          {"field": {"Name": "body_c"}},
          {"field": {"Name": "author_id_c"}},
          {"field": {"Name": "author_name_c"}},
          {"field": {"Name": "author_reputation_c"}},
          {"field": {"Name": "question_id_c"}},
          {"field": {"Name": "votes_c"}},
          {"field": {"Name": "is_accepted_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "updated_at_c"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error("Answer not found");
      }

      const answer = response.data;
      return {
        Id: answer.Id,
        body: answer.body_c || '',
        authorId: answer.author_id_c || '',
        authorName: answer.author_name_c || '',
        authorReputation: answer.author_reputation_c || 1,
        questionId: answer.question_id_c || null,
        votes: answer.votes_c || 0,
        isAccepted: answer.is_accepted_c || false,
        createdAt: answer.created_at_c || new Date().toISOString(),
        updatedAt: answer.updated_at_c || new Date().toISOString()
      };
    } catch (error) {
      console.error(`Error fetching answer ${id}:`, error?.response?.data?.message || error);
      throw new Error("Answer not found");
    }
  }

  async getByQuestionId(questionId) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords(this.tableName, {
        fields: [
          {"field": {"Name": "body_c"}},
          {"field": {"Name": "author_id_c"}},
          {"field": {"Name": "author_name_c"}},
          {"field": {"Name": "author_reputation_c"}},
          {"field": {"Name": "question_id_c"}},
          {"field": {"Name": "votes_c"}},
          {"field": {"Name": "is_accepted_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "updated_at_c"}}
        ],
        where: [{"FieldName": "question_id_c", "Operator": "EqualTo", "Values": [questionId]}]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data.map(answer => ({
        Id: answer.Id,
        body: answer.body_c || '',
        authorId: answer.author_id_c || '',
        authorName: answer.author_name_c || '',
        authorReputation: answer.author_reputation_c || 1,
        questionId: answer.question_id_c || null,
        votes: answer.votes_c || 0,
        isAccepted: answer.is_accepted_c || false,
        createdAt: answer.created_at_c || new Date().toISOString(),
        updatedAt: answer.updated_at_c || new Date().toISOString()
      }));
    } catch (error) {
      console.error(`Error fetching answers for question ${questionId}:`, error?.response?.data?.message || error);
      return [];
    }
  }

  async create(answerData) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.createRecord(this.tableName, {
        records: [{
          body_c: answerData.body || '',
          author_id_c: answerData.authorId || '',
          author_name_c: answerData.authorName || '',
          author_reputation_c: answerData.authorReputation || 1,
          question_id_c: answerData.questionId || null,
          votes_c: 0,
          is_accepted_c: false,
          created_at_c: new Date().toISOString(),
          updated_at_c: new Date().toISOString()
        }]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} answers:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          const createdAnswer = successful[0].data;
          return {
            Id: createdAnswer.Id,
            body: createdAnswer.body_c || '',
            authorId: createdAnswer.author_id_c || '',
            authorName: createdAnswer.author_name_c || '',
            authorReputation: createdAnswer.author_reputation_c || 1,
            questionId: createdAnswer.question_id_c || null,
            votes: createdAnswer.votes_c || 0,
            isAccepted: createdAnswer.is_accepted_c || false,
            createdAt: createdAnswer.created_at_c || new Date().toISOString(),
            updatedAt: createdAnswer.updated_at_c || new Date().toISOString()
          };
        }
      }
      return null;
    } catch (error) {
      console.error("Error creating answer:", error?.response?.data?.message || error);
      return null;
    }
  }

  async update(id, updateData) {
    try {
      const apperClient = getApperClient();
      const updateRecord = {
        Id: id,
        updated_at_c: new Date().toISOString()
      };

      if (updateData.body) updateRecord.body_c = updateData.body;
      if (updateData.votes !== undefined) updateRecord.votes_c = updateData.votes;
      if (updateData.isAccepted !== undefined) updateRecord.is_accepted_c = updateData.isAccepted;

      const response = await apperClient.updateRecord(this.tableName, {
        records: [updateRecord]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error("Answer not found");
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} answers:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          throw new Error("Answer not found");
        }

        if (successful.length > 0) {
          const updatedAnswer = successful[0].data;
          return {
            Id: updatedAnswer.Id,
            body: updatedAnswer.body_c || '',
            authorId: updatedAnswer.author_id_c || '',
            authorName: updatedAnswer.author_name_c || '',
            authorReputation: updatedAnswer.author_reputation_c || 1,
            questionId: updatedAnswer.question_id_c || null,
            votes: updatedAnswer.votes_c || 0,
            isAccepted: updatedAnswer.is_accepted_c || false,
            createdAt: updatedAnswer.created_at_c || new Date().toISOString(),
            updatedAt: updatedAnswer.updated_at_c || new Date().toISOString()
          };
        }
      }
      throw new Error("Answer not found");
    } catch (error) {
      console.error("Error updating answer:", error?.response?.data?.message || error);
      throw new Error("Answer not found");
    }
  }

  async delete(id) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.deleteRecord(this.tableName, {
        RecordIds: [id]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error("Answer not found");
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} answers:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          throw new Error("Answer not found");
        }

        return successful.length > 0;
      }
      throw new Error("Answer not found");
    } catch (error) {
      console.error("Error deleting answer:", error?.response?.data?.message || error);
      throw new Error("Answer not found");
    }
  }

  async vote(id, userId, voteValue) {
    try {
      const answer = await this.getById(id);
      return await this.update(id, {
        votes: (answer.votes || 0) + voteValue
      });
    } catch (error) {
      console.error("Error voting on answer:", error?.response?.data?.message || error);
      throw new Error("Answer not found");
    }
  }

  async accept(id) {
    try {
      const answer = await this.getById(id);
      if (!answer.questionId) {
        throw new Error("Answer not found");
      }

      // First unaccept other answers for the same question
      const questionAnswers = await this.getByQuestionId(answer.questionId);
      for (const ans of questionAnswers) {
        if (ans.Id !== id && ans.isAccepted) {
          await this.update(ans.Id, { isAccepted: false });
        }
      }

      // Accept this answer
      return await this.update(id, { isAccepted: true });
    } catch (error) {
      console.error("Error accepting answer:", error?.response?.data?.message || error);
      throw new Error("Answer not found");
    }
  }
}

export default new AnswerService();