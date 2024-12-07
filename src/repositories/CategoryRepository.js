import HTTP from "@/common/http";

const resource = "categories";

export default {
  async findAll() {
    return (await HTTP.get(resource)).data;
  },
  /* Si no pongo el .data recibiré un json con staus, headers, data, etc, solo me interesa el .data*/
  async findOne(id) {
    return (await HTTP.get(`${resource}/${id}`)).data;
  },

  async save(category) {
    if (category.id) {
      return await HTTP.put(`${resource}/${category.id}`, category);
    } else {
      return await HTTP.post(`${resource}`, category);
    }
  },

  async delete(id) {
    return await HTTP.delete(`${resource}/${id}`);
  }
};
