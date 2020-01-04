const homeController = {}

homeController.index = async (req, res, next) => {
  try {
    res.render('home/index')
  } catch (error) {
    next(error)
  }
}
module.exports = homeController
