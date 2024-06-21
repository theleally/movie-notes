const knex = require("../database/knex");

class MovieNotesController {
  async create(request, response) {
    const { title, description, rating, tags } = request.body;
    const { user_id } = request.params;

    const [movie_note_id] = await knex("movie_notes").insert({
      title,
      description,
      rating,
      user_id
    });

    const tagsInsert = tags.map(name => {
      return {
        movie_note_id,
        name,
        user_id
      }
    });

    await knex("movie_tags").insert(tagsInsert);

    response.json();
  }

  async show(request, response) {
    const { id } = request.params;

    const note = await knex("movie_notes").where({ id }).first();
    const tags = await knex("movie_tags").where({ movie_note_id: id }).orderBy("name");
    
    return response.json({
      ...note,
      tags
    });
  }

  async delete(request, response) {
    const { id } = request.params;

    await knex("movie_notes").where({ id }).delete();

    response.json();
  }

  async index(request, response) {
    const { user_id, title } = request.query;

    const movieNotes = await knex("movie_notes").where({ user_id }).whereLike("title", `%${title}%`).orderBy("title");

    response.json(movieNotes);
  }
}

module.exports = MovieNotesController;