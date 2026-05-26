// utils/responseBuilder.js
const { convertDateToString } = require("./DateUtil");
const Role = require("../models/Role");
const Country = require("../models/Country");

function buildRoleResponse(role) {
  if (!role) return null;

  return {
    id: role._id,
    roleName: role.roleName,
    roleDescription: role.roleDescription,
    roleModuleList: role.roleModuleList
      ? role.roleModuleList.map(rm => buildRoleModuleResponse(rm))
      : [],
    status: role.status,
    createdAt: convertDateToString(role.createdAt),
    updatedAt: convertDateToString(role.updatedAt),
  };
}

function buildRoleModuleResponse(roleModule) {
  if (!roleModule) return null;

  return {
    id: roleModule._id,
    roleId: roleModule.roleId,
    moduleId: roleModule.moduleId?._id || roleModule.moduleId, // handle populated vs ObjectId
    moduleName: roleModule.moduleName,
    moduleCode: roleModule.moduleCode,
    parentModuleName: roleModule.parentModuleName,
    moduleAction: roleModule.moduleAction,
    addAction: roleModule.addAction,
    updateAction: roleModule.updateAction,
    deleteAction: roleModule.deleteAction,
    downloadAction: roleModule.downloadAction,
    viewAction: roleModule.viewAction,
    status: roleModule.status,
    createdAt: convertDateToString(roleModule.createdAt),
    updatedAt: convertDateToString(roleModule.updatedAt),
  };
}


function buildModuleResponse(module) {

  if (!module) return null;

  return {
    id: module._id,
    moduleName: module.moduleName,
    parentModuleName: module.parentModuleName,
    moduleCode: module.moduleCode,
    addAction: module.addAction,
    updateAction: module.updateAction,
    deleteAction: module.deleteAction,
    downloadAction: module.downloadAction,
    viewAction: module.viewAction,
    status: module.status,
    createdAt: convertDateToString(module.createdAt),
    updatedAt: convertDateToString(module.updatedAt),
  };
}

function buildUserResponse(user) {
  if (!user) return null;

  return {
    id: user._id,
    name: user.name || "",
    email: user.email || "",
    countryCode: user.countryCode || "",
    mobileNumber: user.mobileNumber || "",
    address: user.address || "",
    city: user.city || "",
    country: user.country || "",
    profileUrl: user.profileUrl || "",
    status: user.status,
    profileCompleted: user.profileCompleted || false,
    roleId: user.roleId || "",
    createdAt: convertDateToString(user.createdAt),
    updatedAt: convertDateToString(user.updatedAt),
  };
}

async function buildUserRoleResponse(user) {
  if (!user) return null;

  let role = null;
  if (user.roleId) {
      role = await Role.findById(user.roleId).populate("roleModuleList");
  }

  return {
    id: user._id,
    name: user.name || "",
    email: user.email || "",
    countryCode: user.countryCode || "",
    mobileNumber: user.mobileNumber || "",
    address: user.address || "",
    city: user.city || "",
    country: user.country || "",
    profileUrl: user.profileUrl || "",
    status: user.status,
    profileCompleted: user.profileCompleted || false,
    roleId: user.roleId,
    createdAt: convertDateToString(user.createdAt),
    updatedAt: convertDateToString(user.updatedAt),

    // ✅ embed fetched role
    roleResponse: role ? buildRoleResponse(role) : null
  };
}

function buildCountryResponse(country) {

  if (!country) return null;

  return {
    id: country._id,
    countryCode: country.countryCode,
    countryName: country.countryName,
    countryShortCode: country.countryShortCode,
    currencyCode: country.currencyCode,
    currencySymbol: country.currencySymbol,
    status: country.status,
    createdAt: convertDateToString(country.createdAt),
    updatedAt: convertDateToString(country.updatedAt),
  };
}

async function buildCityResponse(city,countryId) {

  if (!city) return null;

    let countryName = null;
  try{


  if (countryId) {
    const  country = await Country.findById(countryId);
    countryName = country.countryName;
    
  }
  }catch(error){

  }
  return {
    id: city._id,
    countryId: city.countryId,
    cityName: city.cityName,
    cityImage: city.cityImage,
    cityIcon: city.cityIcon,
    latitude: city.latitude,
    longitude: city.longitude,
    countryName,
    status: city.status,
    createdAt: convertDateToString(city.createdAt),
    updatedAt: convertDateToString(city.updatedAt),
  };
}

function buildContentResponse(content) {
  if (!content) return null;

  return {
    id: content._id,
    type: content.type,
    lang: content.lang,
    content: content.content,
    createdAt: convertDateToString(content.createdAt),
    updatedAt: convertDateToString(content.updatedAt),
  };
}


function buildBlogResponse(blog) {
  if (!blog) return null;

  return {
    id: blog._id,
    title: blog.title,
    category: blog.category || "",
    writtenBy: blog.writtenBy,
    difficulty: blog.difficulty,
    topic: blog.topic,
    content: blog.content,
    thumbnailFile: blog.thumbnailFile || "",
    mediaFiles: blog.mediaFiles || [],
    status: blog.status,
    createdAt: convertDateToString(blog.createdAt),
    updatedAt: convertDateToString(blog.updatedAt),
  };
}

function buildOurServiceResponse(service) {
  if (!service) return null;

  return {
    id: service._id,
    title: service.title,
    subTitle: service.subTitle,
    shortDescriptions: service.shortDescriptions,
    fullDescriptions: service.fullDescriptions,
    serviceOffered: service.serviceOffered || [],
    icon: service.icon,
    thumbnailFile: service.thumbnailFile,
    galleryFiles: service.galleryFiles || [],
    status: service.status,
    createdAt: convertDateToString(service.createdAt),
    updatedAt: convertDateToString(service.updatedAt),
  };
}

function buildContactInfoResponse(contact) {
  if (!contact) return null;

  return {
    id: contact._id,
    email: contact.email,
    mobile: contact.mobile,
    address: contact.address,
    createdAt: convertDateToString(contact.createdAt),
    updatedAt: convertDateToString(contact.updatedAt),
  };
}

function buildPortfolioResponse(portfolio) {
  if (!portfolio) return null;

  return {
    id: portfolio._id,
    title: portfolio.title,
    category: portfolio.category,
    year: portfolio.year,
    city: portfolio.city,
    country: portfolio.country,
    location: portfolio.location,
    shortDescription: portfolio.shortDescription,
    fullDescription: portfolio.fullDescription,
    status: portfolio.status,
    featured: portfolio.featured,
    clientName: portfolio.clientName,
    surfaceArea: portfolio.surfaceArea,
    scope: portfolio.scope,
    softwareUsed: portfolio.softwareUsed,
    tags: portfolio.tags || [],
    thumbnailFile: portfolio.thumbnailFile,
    galleryFiles: portfolio.galleryFiles || [],
    createdAt: convertDateToString(portfolio.createdAt),
    updatedAt: convertDateToString(portfolio.updatedAt),
  };
}

function buildHomeBannerResponse(banner) {
  if (!banner) return null;

  return {
    id: banner._id,
    mediaFiles: banner.mediaFiles,
    type: banner.type,
    createdAt: convertDateToString(banner.createdAt),
    updatedAt: convertDateToString(banner.updatedAt),
  };
}

function buildAboutUsResponse(about) {
  if (!about) return null;

  return {
    mainTitle: about.mainTitle || "",
    mainDescription: about.mainDescription || "",
    mission: about.mission || "",
    vision: about.vision || "",
    aboutImage: about.aboutImage || "",
    statPoints: (about.statPoints || []).map((s) => ({ id: s._id, value: s.value, label: s.label })),
    advantagePoints: (about.advantagePoints || []).map((a) => ({ id: a._id, title: a.title, description: a.description })),
    workSteps: (about.workSteps || []).map((w) => ({ id: w._id, step: w.step, icon: w.icon, title: w.title, description: w.description })),
    clientStories: (about.clientStories || []).map((c) => ({ id: c._id, quote: c.quote, name: c.name, title: c.title })),
    teamMembers: (about.teamMembers || []).map((t) => ({ id: t._id, name: t.name, designation: t.designation, bio: t.bio, image: t.image, order: t.order })),
    createdAt: convertDateToString(about.createdAt),
    updatedAt: convertDateToString(about.updatedAt),
  };
}

function buildEnquiryResponse(enquiry) {
  if (!enquiry) return null;

  return {
    id: enquiry._id,
    name: enquiry.name,
    email: enquiry.email,
    projectType: enquiry.projectType,
    message: enquiry.message,
    read: enquiry.read ?? false,
    status: enquiry.status,
    createdAt: convertDateToString(enquiry.createdAt),
    updatedAt: convertDateToString(enquiry.updatedAt),
  };
}

function buildSoundResponse(sound) {
  if (!sound) return null;

  return {
    id: sound._id,
    title: sound.title,
    soundUrl: sound.soundUrl,
    status: sound.status,
    createdAt: convertDateToString(sound.createdAt),
    updatedAt: convertDateToString(sound.updatedAt),
  };
}




module.exports = {
  buildUserRoleResponse,
  buildUserResponse,
  buildRoleResponse,
  buildRoleModuleResponse,
  buildModuleResponse,
  buildCountryResponse,
  buildCityResponse,
  buildContentResponse,
  buildBlogResponse,
  buildAboutUsResponse,
  buildEnquiryResponse,
  buildOurServiceResponse,
  buildContactInfoResponse,
  buildPortfolioResponse,
  buildHomeBannerResponse,
  buildSoundResponse
};
