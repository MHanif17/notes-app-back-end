//import nanoid
const { nanoid } = require('nanoid');
//import notes.js
const notes = require('./notes');

const addNoteHandler = (request, h) => {

   //untuk mendapatkan body request (request.playload)
    const { title, tags, body } = request.payload;

    //panggil method nanoid() dan berikan parameter number yang merupakan ukuran dari string-nya
    const id = nanoid(16);

    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;
   
   // masukan nilai-nilai data tersebut ke dalam variabel newNote.    
    const newNote = {
      title, tags, body, id, createdAt, updatedAt,
    };
   
     // masukan variabel newNote ke dalam array notes menggunakan method push().
    notes.push(newNote);
   
    //memanfaatkan method filter() berdasarkan id catatan untuk mengetahui apakah newNote sudah masuk ke dalam array notes
    const isSuccess = notes.filter((note) => note.id === id).length > 0;
   
      //gunakan isSuccess untuk menentukan respons yang diberikan server. Jika isSuccess bernilai true, maka beri respons berhasil. Jika false, maka beri respons gagal.
    if (isSuccess) {
      const response = h.response({
        status: 'success',
        message: 'Catatan berhasil ditambahkan',
        data: {
          noteId: id,
        },
      });
      response.code(201);
      return response;
    }

    const response = h.response({
      status: 'fail',
      message: 'Catatan gagal ditambahkan',
    });
    response.code(500);
    return response;
};

const getAllNotesHandler = () => ({
    status: 'success',
    data: {
        notes,
    },
});

const getNoteByIdHandler = (request, h) => {
  //kita dapatkan dulu nilai id dari request.params.
    const { id } = request.params;
  
  //dapatkan objek note dengan id tersebut dari objek array notes. Manfaatkan method array filter() untuk mendapatkan objeknya.
    const note = notes.filter((n) => n.id === id)[0];
   
  //kembalikan fungsi handler dengan data beserta objek note di dalamnya  & pastikan tidak bernilai undifined
   if (note !== undefined) {
      return {
        status: 'success',
        data: {
          note,
        },
      };
    }
  
  //Bila undifined respon dengan gagal
    const response = h.response({
      status: 'fail',
      message: 'Catatan tidak ditemukan',
    });
    response.code(404);
    return response;
  };

  const editNoteByIdHandler = (request, h) => {
    //data yg diubah sesuai dgn id. dapatakan id
    const { id } = request.params;

    //dapatakan request body
    const { title, tags, body } = request.payload;

    const updatedAt = new Date().toISOString();

    //menggunakan index array untuk mendapatakan id catatan
    const index = notes.findIndex((note) => note.id === id);

    if (index !== -1) {
      notes[index] = {
        ...notes[index],
        title,
        tags,
        body,
        updatedAt,
      };

      const response = h.response({
        status: 'success',
        message: 'Catatan berhasil diperbaharui'
      });
      response.code(200);
      return response;
    };

    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui catatan. Id tidak ditemukan'
    });
    response.code(400);
    return response;

  };

  const deleteNoteByIdHandler = ( request, h ) => {
    const { id } = request.params;

    const index = notes.findIndex((note) => note.id === id);

    if (index !== 1) {
      notes.splice(index, 1);
      const response = h.response({
        status: 'success',
        message: 'Catatan berhasil dihapus'
      });
      response.code(200);
      return response
    };

    const response = h.response({
      status: 'fail',
      message: 'Catatan gagal di hapus. Id tidak diteemukan'
    })
    response.code(400);
    return response;
  }
   
  module.exports = { addNoteHandler, getAllNotesHandler, getNoteByIdHandler, editNoteByIdHandler, deleteNoteByIdHandler };


