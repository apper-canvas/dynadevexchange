import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";

class UserService {
  constructor() {
    this.tableName = "user_c";
  }

  async getAll() {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords(this.tableName, {
        fields: [
          {"field": {"Name": "username_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "reputation_c"}},
          {"field": {"Name": "badges_c"}},
          {"field": {"Name": "joined_at_c"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data.map(user => ({
        Id: user.Id,
        username: user.username_c || '',
        displayName: user.username_c || '',
        email: user.email_c || '',
        reputation: user.reputation_c || 1,
        badges: this.parseBadges(user.badges_c),
        joinedAt: user.joined_at_c || new Date().toISOString(),
        joinDate: user.joined_at_c || new Date().toISOString(),
        questionIds: [],
        answerIds: []
      }));
    } catch (error) {
      console.error("Error fetching users:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getById(id) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.getRecordById(this.tableName, id, {
        fields: [
          {"field": {"Name": "username_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "reputation_c"}},
          {"field": {"Name": "badges_c"}},
          {"field": {"Name": "joined_at_c"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(`User with ID '${id}' not found`);
      }

      const user = response.data;
      return {
        Id: user.Id,
        username: user.username_c || '',
        displayName: user.username_c || '',
        email: user.email_c || '',
        reputation: user.reputation_c || 1,
        badges: this.parseBadges(user.badges_c),
        joinedAt: user.joined_at_c || new Date().toISOString(),
        joinDate: user.joined_at_c || new Date().toISOString(),
        questionsAsked: 0,
        answersProvided: 0,
        acceptedAnswers: 0
      };
    } catch (error) {
      console.error(`Error fetching user ${id}:`, error?.response?.data?.message || error);
      throw new Error(`User with ID '${id}' not found`);
    }
  }

  async getByUsername(username) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords(this.tableName, {
        fields: [
          {"field": {"Name": "username_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "reputation_c"}},
          {"field": {"Name": "badges_c"}},
          {"field": {"Name": "joined_at_c"}}
        ],
        where: [{"FieldName": "username_c", "Operator": "EqualTo", "Values": [username]}]
      });

      if (!response.success || !response.data || response.data.length === 0) {
        throw new Error("User not found");
      }

      const user = response.data[0];
      return {
        Id: user.Id,
        username: user.username_c || '',
        displayName: user.username_c || '',
        email: user.email_c || '',
        reputation: user.reputation_c || 1,
        badges: this.parseBadges(user.badges_c),
        joinedAt: user.joined_at_c || new Date().toISOString(),
        joinDate: user.joined_at_c || new Date().toISOString()
      };
    } catch (error) {
      console.error("Error fetching user by username:", error?.response?.data?.message || error);
      throw new Error("User not found");
    }
  }

  async create(userData) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.createRecord(this.tableName, {
        records: [{
          username_c: userData.username || '',
          email_c: userData.email || '',
          reputation_c: 1,
          badges_c: JSON.stringify([{ name: "Student", type: "bronze" }]),
          joined_at_c: new Date().toISOString()
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
          console.error(`Failed to create ${failed.length} users:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          const createdUser = successful[0].data;
          return {
            Id: createdUser.Id,
            username: createdUser.username_c || '',
            displayName: createdUser.username_c || '',
            email: createdUser.email_c || '',
            reputation: createdUser.reputation_c || 1,
            badges: this.parseBadges(createdUser.badges_c),
            joinedAt: createdUser.joined_at_c || new Date().toISOString(),
            questionIds: [],
            answerIds: []
          };
        }
      }
      return null;
    } catch (error) {
      console.error("Error creating user:", error?.response?.data?.message || error);
      return null;
    }
  }

  async update(id, updateData) {
    try {
      const apperClient = getApperClient();
      const updateRecord = {
        Id: id
      };

      if (updateData.username) updateRecord.username_c = updateData.username;
      if (updateData.email) updateRecord.email_c = updateData.email;
      if (updateData.reputation !== undefined) updateRecord.reputation_c = updateData.reputation;
      if (updateData.badges) updateRecord.badges_c = JSON.stringify(updateData.badges);

      const response = await apperClient.updateRecord(this.tableName, {
        records: [updateRecord]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error("User not found");
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} users:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          throw new Error("User not found");
        }

        if (successful.length > 0) {
          const updatedUser = successful[0].data;
          return {
            Id: updatedUser.Id,
            username: updatedUser.username_c || '',
            displayName: updatedUser.username_c || '',
            email: updatedUser.email_c || '',
            reputation: updatedUser.reputation_c || 1,
            badges: this.parseBadges(updatedUser.badges_c),
            joinedAt: updatedUser.joined_at_c || new Date().toISOString()
          };
        }
      }
      throw new Error("User not found");
    } catch (error) {
      console.error("Error updating user:", error?.response?.data?.message || error);
      throw new Error("User not found");
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
        throw new Error("User not found");
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} users:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          throw new Error("User not found");
        }

        return successful.length > 0;
      }
      throw new Error("User not found");
    } catch (error) {
      console.error("Error deleting user:", error?.response?.data?.message || error);
      throw new Error("User not found");
    }
  }

  async updateReputation(id, points) {
    try {
      const user = await this.getById(id);
      const newReputation = Math.max(0, (user.reputation || 0) + points);
      
      // Award badges based on reputation milestones
      const updatedBadges = this.checkAndAwardBadges(user.badges || [], newReputation);
      
      return await this.update(id, {
        reputation: newReputation,
        badges: updatedBadges
      });
    } catch (error) {
      console.error("Error updating reputation:", error?.response?.data?.message || error);
      throw new Error("User not found");
    }
  }

  checkAndAwardBadges(currentBadges, reputation) {
    const badges = [...(currentBadges || [])];
    
    // Bronze badges
    if (reputation >= 100 && !badges.some(b => b.name === "Supporter")) {
      badges.push({ name: "Supporter", type: "bronze" });
    }
    
    if (reputation >= 500 && !badges.some(b => b.name === "Teacher")) {
      badges.push({ name: "Teacher", type: "bronze" });
    }
    
    // Silver badges
    if (reputation >= 1000 && !badges.some(b => b.name === "Scholar")) {
      badges.push({ name: "Scholar", type: "silver" });
    }
    
    if (reputation >= 2000 && !badges.some(b => b.name === "Enlightened")) {
      badges.push({ name: "Enlightened", type: "silver" });
    }
    
    // Gold badges
    if (reputation >= 5000 && !badges.some(b => b.name === "Guru")) {
      badges.push({ name: "Guru", type: "gold" });
    }
    
    return badges;
  }

  parseBadges(badgesStr) {
    try {
      if (!badgesStr) return [{ name: "Student", type: "bronze" }];
      const parsed = JSON.parse(badgesStr);
      return Array.isArray(parsed) ? parsed : [{ name: "Student", type: "bronze" }];
    } catch {
      return [{ name: "Student", type: "bronze" }];
    }
  }
}

export default new UserService();