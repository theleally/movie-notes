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
}

module.exports = MovieNotesController;