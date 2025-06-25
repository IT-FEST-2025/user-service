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

  username: Joi.string().min(4).max(30).required().messages({
    "string.empty": "Username tidak boleh kosong",
    "string.alphanum": "Username hanya boleh berisi huruf dan angka",
    "string.min": "Username minimal 4 karakter",
    "string.max": "Username maksimal 30 karakter",
    "any.required": "Username wajib diisi",
  }),
});

const userLoginSchema = Joi.object({
  username: Joi.string().min(4).max(30).required().messages({
    "string.empty": "Username tidak boleh kosong",
    "string.min": "Username minimal 4 karakter",
    "any.required": "Username wajib diisi",
    "string.max": "Username maksimal 30 karakter",
  }),

  password: Joi.string().required().min(4).messages({
    "string.empty": "Password tidak boleh kosong",
    "any.required": "Password wajib diisi",
    "string.min": "Username minimal 4 karakter",
  }),
});

const updateUserSchema = Joi.object({
  age: Joi.number().integer().min(0),
  gender: Joi.string().valid("pria", "wanita", "lainnya"),
  height_cm: Joi.number().integer().min(0),
  weight_kg: Joi.number().precision(2).min(0),
  chronic_diseases: Joi.array().items(Joi.string()),
  smoking_status: Joi.string().valid("aktif", "tidak aktif"),
}).min(1); // Harus ada minimal 1 field

export { userRegisterSchema, userLoginSchema, updateUserSchema };
