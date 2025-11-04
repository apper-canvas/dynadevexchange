import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";

class TagService {
  constructor() {
    this.tableName = "tag_c";
  }

  async getAll() {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords(this.tableName, {
        fields: [
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "question_count_c"}},
          {"field": {"Name": "followers_c"}},
          {"field": {"Name": "created_at_c"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data.map(tag => ({
        Id: tag.Id,
        name: tag.name_c || '',
        description: tag.description_c || '',
        questionCount: tag.question_count_c || 0,
        followers: tag.followers_c || 0,
        createdAt: tag.created_at_c || new Date().toISOString()
      }));
    } catch (error) {
      console.error("Error fetching tags:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getById(id) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.getRecordById(this.tableName, id, {
        fields: [
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "question_count_c"}},
          {"field": {"Name": "followers_c"}},
          {"field": {"Name": "created_at_c"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error("Tag not found");
      }

      const tag = response.data;
      return {
        Id: tag.Id,
        name: tag.name_c || '',
        description: tag.description_c || '',
        questionCount: tag.question_count_c || 0,
        followers: tag.followers_c || 0,
        createdAt: tag.created_at_c || new Date().toISOString()
      };
    } catch (error) {
      console.error(`Error fetching tag ${id}:`, error?.response?.data?.message || error);
      throw new Error("Tag not found");
    }
  }

  async getPopular(limit = 20) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords(this.tableName, {
        fields: [
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "question_count_c"}},
          {"field": {"Name": "followers_c"}},
          {"field": {"Name": "created_at_c"}}
        ],
        orderBy: [{"fieldName": "question_count_c", "sorttype": "DESC"}],
        pagingInfo: {"limit": limit, "offset": 0}
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data.map(tag => ({
        Id: tag.Id,
        name: tag.name_c || '',
        description: tag.description_c || '',
        questionCount: tag.question_count_c || 0,
        followers: tag.followers_c || 0,
        createdAt: tag.created_at_c || new Date().toISOString()
      }));
    } catch (error) {
      console.error("Error fetching popular tags:", error?.response?.data?.message || error);
      return [];
    }
  }

  async search(query) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords(this.tableName, {
        fields: [
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "question_count_c"}},
          {"field": {"Name": "followers_c"}},
          {"field": {"Name": "created_at_c"}}
        ],
        where: [
          {"FieldName": "name_c", "Operator": "Contains", "Values": [query]},
          {"FieldName": "description_c", "Operator": "Contains", "Values": [query]}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data.map(tag => ({
        Id: tag.Id,
        name: tag.name_c || '',
        description: tag.description_c || '',
        questionCount: tag.question_count_c || 0,
        followers: tag.followers_c || 0,
        createdAt: tag.created_at_c || new Date().toISOString()
      }));
    } catch (error) {
      console.error("Error searching tags:", error?.response?.data?.message || error);
      return [];
    }
  }

  async create(tagData) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.createRecord(this.tableName, {
        records: [{
          name_c: tagData.name || '',
          description_c: tagData.description || '',
          question_count_c: 0,
          followers_c: 0,
          created_at_c: new Date().toISOString()
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
          console.error(`Failed to create ${failed.length} tags:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          const createdTag = successful[0].data;
          return {
            Id: createdTag.Id,
            name: createdTag.name_c || '',
            description: createdTag.description_c || '',
            questionCount: createdTag.question_count_c || 0,
            followers: createdTag.followers_c || 0,
            createdAt: createdTag.created_at_c || new Date().toISOString()
          };
        }
      }
      return null;
    } catch (error) {
      console.error("Error creating tag:", error?.response?.data?.message || error);
      return null;
    }
  }

  async update(id, updateData) {
    try {
      const apperClient = getApperClient();
      const updateRecord = {
        Id: id
      };

      if (updateData.name) updateRecord.name_c = updateData.name;
      if (updateData.description) updateRecord.description_c = updateData.description;
      if (updateData.questionCount !== undefined) updateRecord.question_count_c = updateData.questionCount;
      if (updateData.followers !== undefined) updateRecord.followers_c = updateData.followers;

      const response = await apperClient.updateRecord(this.tableName, {
        records: [updateRecord]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error("Tag not found");
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} tags:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          throw new Error("Tag not found");
        }

        if (successful.length > 0) {
          const updatedTag = successful[0].data;
          return {
            Id: updatedTag.Id,
            name: updatedTag.name_c || '',
            description: updatedTag.description_c || '',
            questionCount: updatedTag.question_count_c || 0,
            followers: updatedTag.followers_c || 0,
            createdAt: updatedTag.created_at_c || new Date().toISOString()
          };
        }
      }
      throw new Error("Tag not found");
    } catch (error) {
      console.error("Error updating tag:", error?.response?.data?.message || error);
      throw new Error("Tag not found");
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
        throw new Error("Tag not found");
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} tags:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          throw new Error("Tag not found");
        }

        return successful.length > 0;
      }
      throw new Error("Tag not found");
    } catch (error) {
      console.error("Error deleting tag:", error?.response?.data?.message || error);
      throw new Error("Tag not found");
    }
  }

  async follow(tagId, userId) {
    try {
      const tag = await this.getById(tagId);
      return await this.update(tagId, {
        followers: (tag.followers || 0) + 1
      });
    } catch (error) {
      console.error("Error following tag:", error?.response?.data?.message || error);
      throw new Error("Tag not found");
    }
  }

  async unfollow(tagId, userId) {
    try {
      const tag = await this.getById(tagId);
      return await this.update(tagId, {
        followers: Math.max(0, (tag.followers || 0) - 1)
      });
    } catch (error) {
      console.error("Error unfollowing tag:", error?.response?.data?.message || error);
      throw new Error("Tag not found");
    }
  }
}

export default new TagService();