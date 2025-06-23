import Joi from "joi";
const userRegisterSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.empty": "Email tidak boleh kosong",
      "string.email": "Format email tidak valid",
      "any.required": "Email wajib diisi",
    }),

  password: Joi.string().min(4).required().messages({
    "string.empty": "Password tidak boleh kosong",
    "string.min": "Password minimal 6 karakter",
    "any.required": "Password wajib diisi",
  }),

  fullName: Joi.string().required().messages({
    "string.empty": "Nama lengkap tidak boleh kosong",
    "any.required": "Nama lengkap wajib diisi",
  }),

  username: Joi.string().min(3).max(30).required().messages({
    "string.empty": "Username tidak boleh kosong",
    "string.alphanum": "Username hanya boleh berisi huruf dan angka",
    "string.min": "Username minimal 3 karakter",
    "string.max": "Username maksimal 30 karakter",
    "any.required": "Username wajib diisi",
  }),
});

const userLoginSchema = Joi.object({
  username: Joi.string().required().messages({
    "string.empty": "Username tidak boleh kosong",
    "any.required": "Username wajib diisi",
  }),

  password: Joi.string().required().messages({
    "string.empty": "Password tidak boleh kosong",
    "any.required": "Password wajib diisi",
  }),
});

export { userRegisterSchema, userLoginSchema };
