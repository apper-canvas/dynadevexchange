import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";

class QuestionService {
  constructor() {
    this.tableName = "question_c";
  }

  async getAll() {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords(this.tableName, {
        fields: [
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "body_c"}},
          {"field": {"Name": "author_id_c"}},
          {"field": {"Name": "author_name_c"}},
          {"field": {"Name": "author_reputation_c"}},
          {"field": {"Name": "votes_c"}},
          {"field": {"Name": "answer_count_c"}},
          {"field": {"Name": "views_c"}},
          {"field": {"Name": "accepted_answer_id_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "updated_at_c"}},
          {"field": {"Name": "Tags"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data.map(question => ({
        Id: question.Id,
        title: question.title_c || '',
        body: question.body_c || '',
        authorId: question.author_id_c || '',
        authorName: question.author_name_c || '',
        authorReputation: question.author_reputation_c || 1,
        votes: question.votes_c || 0,
        answerCount: question.answer_count_c || 0,
        views: question.views_c || 0,
        acceptedAnswerId: question.accepted_answer_id_c || null,
        createdAt: question.created_at_c || new Date().toISOString(),
        updatedAt: question.updated_at_c || new Date().toISOString(),
        tags: this.parseTags(question.Tags)
      }));
    } catch (error) {
      console.error("Error fetching questions:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getById(id) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.getRecordById(this.tableName, id, {
        fields: [
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "body_c"}},
          {"field": {"Name": "author_id_c"}},
          {"field": {"Name": "author_name_c"}},
          {"field": {"Name": "author_reputation_c"}},
          {"field": {"Name": "votes_c"}},
          {"field": {"Name": "answer_count_c"}},
          {"field": {"Name": "views_c"}},
          {"field": {"Name": "accepted_answer_id_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "updated_at_c"}},
          {"field": {"Name": "Tags"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error("Question not found");
      }

      const question = response.data;
      return {
        Id: question.Id,
        title: question.title_c || '',
        body: question.body_c || '',
        authorId: question.author_id_c || '',
        authorName: question.author_name_c || '',
        authorReputation: question.author_reputation_c || 1,
        votes: question.votes_c || 0,
        answerCount: question.answer_count_c || 0,
        views: question.views_c || 0,
        acceptedAnswerId: question.accepted_answer_id_c || null,
        createdAt: question.created_at_c || new Date().toISOString(),
        updatedAt: question.updated_at_c || new Date().toISOString(),
        tags: this.parseTags(question.Tags)
      };
    } catch (error) {
      console.error(`Error fetching question ${id}:`, error?.response?.data?.message || error);
      throw new Error("Question not found");
    }
  }

  async create(questionData) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.createRecord(this.tableName, {
        records: [{
          title_c: questionData.title || '',
          body_c: questionData.body || '',
          author_id_c: questionData.authorId || '',
          author_name_c: questionData.authorName || '',
          author_reputation_c: questionData.authorReputation || 1,
          votes_c: 0,
          answer_count_c: 0,
          views_c: 1,
          accepted_answer_id_c: null,
          created_at_c: new Date().toISOString(),
          updated_at_c: new Date().toISOString(),
          Tags: questionData.tags ? questionData.tags.join(',') : ''
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
          console.error(`Failed to create ${failed.length} questions:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          const createdQuestion = successful[0].data;
          return {
            Id: createdQuestion.Id,
            title: createdQuestion.title_c || '',
            body: createdQuestion.body_c || '',
            authorId: createdQuestion.author_id_c || '',
            authorName: createdQuestion.author_name_c || '',
            authorReputation: createdQuestion.author_reputation_c || 1,
            votes: createdQuestion.votes_c || 0,
            answerCount: createdQuestion.answer_count_c || 0,
            views: createdQuestion.views_c || 1,
            acceptedAnswerId: createdQuestion.accepted_answer_id_c || null,
            createdAt: createdQuestion.created_at_c || new Date().toISOString(),
            updatedAt: createdQuestion.updated_at_c || new Date().toISOString(),
            tags: this.parseTags(createdQuestion.Tags)
          };
        }
      }
      return null;
    } catch (error) {
      console.error("Error creating question:", error?.response?.data?.message || error);
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

      if (updateData.title) updateRecord.title_c = updateData.title;
      if (updateData.body) updateRecord.body_c = updateData.body;
      if (updateData.votes !== undefined) updateRecord.votes_c = updateData.votes;
      if (updateData.answerCount !== undefined) updateRecord.answer_count_c = updateData.answerCount;
      if (updateData.views !== undefined) updateRecord.views_c = updateData.views;
      if (updateData.acceptedAnswerId !== undefined) updateRecord.accepted_answer_id_c = updateData.acceptedAnswerId;
      if (updateData.tags) updateRecord.Tags = updateData.tags.join(',');

      const response = await apperClient.updateRecord(this.tableName, {
        records: [updateRecord]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error("Question not found");
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} questions:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          throw new Error("Question not found");
        }

        if (successful.length > 0) {
          const updatedQuestion = successful[0].data;
          return {
            Id: updatedQuestion.Id,
            title: updatedQuestion.title_c || '',
            body: updatedQuestion.body_c || '',
            authorId: updatedQuestion.author_id_c || '',
            authorName: updatedQuestion.author_name_c || '',
            authorReputation: updatedQuestion.author_reputation_c || 1,
            votes: updatedQuestion.votes_c || 0,
            answerCount: updatedQuestion.answer_count_c || 0,
            views: updatedQuestion.views_c || 0,
            acceptedAnswerId: updatedQuestion.accepted_answer_id_c || null,
            createdAt: updatedQuestion.created_at_c || new Date().toISOString(),
            updatedAt: updatedQuestion.updated_at_c || new Date().toISOString(),
            tags: this.parseTags(updatedQuestion.Tags)
          };
        }
      }
      throw new Error("Question not found");
    } catch (error) {
      console.error("Error updating question:", error?.response?.data?.message || error);
      throw new Error("Question not found");
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
        throw new Error("Question not found");
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} questions:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          throw new Error("Question not found");
        }

        return successful.length > 0;
      }
      throw new Error("Question not found");
    } catch (error) {
      console.error("Error deleting question:", error?.response?.data?.message || error);
      throw new Error("Question not found");
    }
  }

  async incrementViews(id) {
    try {
      const question = await this.getById(id);
      await this.update(id, {
        views: (question.views || 0) + 1
      });
    } catch (error) {
      console.error("Error incrementing views:", error?.response?.data?.message || error);
    }
  }

  async vote(id, userId, voteValue) {
    try {
      const question = await this.getById(id);
      return await this.update(id, {
        votes: (question.votes || 0) + voteValue
      });
    } catch (error) {
      console.error("Error voting on question:", error?.response?.data?.message || error);
      throw new Error("Question not found");
    }
  }

  async acceptAnswer(questionId, answerId) {
    try {
      return await this.update(questionId, {
        acceptedAnswerId: answerId
      });
    } catch (error) {
      console.error("Error accepting answer:", error?.response?.data?.message || error);
      throw new Error("Question not found");
    }
  }

  parseTags(tagsStr) {
    try {
      if (!tagsStr) return [];
      return tagsStr.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    } catch {
      return [];
    }
  }
}

export default new QuestionService();