import HTTP from "@/common/http";

const resource = "users";

function applyDate(note) {
  note.timestamp = new Date(note.timestamp);
  return note;
}

export default {
  async findAll() {
    return (await HTTP.get(resource)).data;
  },
  /* Si no pongo el .data recibiré un json con status, headers, data, etc, solo me interesa el .data
  Siempre y cuando recupere una nota tengo que aplicarle el applyDate */
  async findOne(id) {
    const response = await HTTP.get(`${resource}/${id}`);
    response.data.notes.forEach(applyDate);
    return response.data.notes;
  },

  async activate(id) {
    return (await HTTP.put(`${resource}/${id}/active`)).data;
  },
  async deactivate(id) {
    return (await HTTP.delete(`${resource}/${id}/active`)).data;
  },
  async delete(id) {
    return await HTTP.delete(`${resource}/${id}`);
  }
};
