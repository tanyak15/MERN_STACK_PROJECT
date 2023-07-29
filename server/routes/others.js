const Router = require("express");
const catchAsyncErrors = require("../middlewares/catchAysncErrors");
const checkAllProvided = require("../utils/helper");
const sendEmail = require("../utils/sendEmail");
const router = Router();

const contactMe = catchAsyncErrors(async (req, res, next) => {
  const { name, email, message } = req.body;

  if (!checkAllProvided(name, email, message)) {
    console.log("ERROR");
  }
  // throw new CustomError(OtherErrors.RequiredFieldsNotProvided);
  const to = process.env.MY_MAIL;
  const subject = "Contact from MusicPlayer";
  const text = `Hey there , I am ${name} and my email id is ${email}.
  ${message}
  `;
  await sendEmail(to, subject, text);
  res.status(200).json({
    success: true,
    message: "Your message has been sent",
  });
});
// contact form
router.route("/contact").post(contactMe);

module.exports = router;
