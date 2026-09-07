import { getProfile } from "../../api/GetProfile.api";
import "./Profile.css";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import PostCreation from "./../PostCreation/PostCreation";
import { getProfilePosts } from "../../api/GetProfilePosts.api";
import PostCard from "../PostCard/PostCard";
import Loading from "../Loading/Loading";
import { FaCamera } from "react-icons/fa";
import { Dropdown, DropdownTrigger, Label } from "@heroui/react";
import { BsFillImageFill } from "react-icons/bs";
import { MdOutlineLinkedCamera } from "react-icons/md";
import { useRef, useState } from "react";
import { Avatar, Input, Button, Modal } from "@heroui/react";
import { IoIosCloseCircle, IoMdImage } from "react-icons/io";
import { useRaf } from "react-use";
import { uploadPhoto } from "../../api/UploadPhoto.api";
import { Bounce, toast } from "react-toastify";
import { Link, useParams } from "react-router-dom";
import { getUserProfile } from "../../api/GetUserProfile.api";
import ApiError from "../ApiError/ApiError";
import cover from '../../../public/cover.jpg'
import { followUsers } from "../../api/FollowUsers.api";

export default function Profile() {
  const { id } = useParams();

  const [isOpen, setIsOpen] = useState(false);
  const [imgIsUploaded, setImgIsUploaded] = useState(false);
  const [isOpenn, setIsOpenn] = useState(false);

  const imageInput = useRef(null);
  const queryClient = useQueryClient();

  const defaultAvatar = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80";

  const { data: followingData, isPending, mutate } = useMutation({
    mutationFn: () => followUsers(targetUserId || userData?._id),
    onSuccess: (response) => {
      const data = response?.data
      console.log(data);

      queryClient.invalidateQueries({ queryKey: ['profile'] })
      queryClient.invalidateQueries({ queryKey: ['userProfile'] })
    }
  })


  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["profile"],
    queryFn: () => getProfile(),
    select: (data) => data?.data?.data?.user,
  });

  const targetUserId = id || data?._id;

  const {
    data: userData,
    isLoading: isUserDataLoading,
    isError: isUserDataError,
    error: userDataError,
  } = useQuery({
    queryKey: ["userProfile", targetUserId],
    queryFn: () => getUserProfile(targetUserId),
    enabled: !!targetUserId,
    select: (data) => data?.data?.data?.user,
  });


  const isMyProfile = !id || String(id) === String(data?._id);
  const profileUser = isMyProfile
    ? {
        ...data,
        ...userData,
        followers:
          Array.isArray(userData?.followers) && userData.followers.length > 0 && typeof userData.followers[0] === "object"
            ? userData.followers
            : data?.followers || userData?.followers || [],
        following:
          Array.isArray(userData?.following) && userData.following.length > 0 && typeof userData.following[0] === "object"
            ? userData.following
            : data?.following || userData?.following || [],
      }
    : userData;

  const followersList = profileUser?.followers || [];
  const followingList = profileUser?.following || [];


  const {
    data: profilePosts,
    isLoading: isProfilePostsLoading,
    isError: isProfilePostsError,
    error: profilePostsError,
  } = useQuery({
    queryKey: ["profilePosts", profileUser?._id],
    queryFn: () => getProfilePosts(profileUser?._id),
    enabled: !!profileUser?._id,
    select: (profilePosts) => profilePosts?.data?.data?.posts,
  });

  console.log("My Profile:", data);
  console.log("User Profile:", userData);
  console.log("Profile Posts:", profilePosts);


  const { isLoading: isUploadProfilePhotoLoading, mutate: uploadProfilePhoto } = useMutation({
    mutationFn: () => uploadPhoto(prepareFormData()),
    onSuccess: (response) => {
      const responseData = response?.data;
      console.log(responseData);

      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["profilePosts"] });

      toast.success(`${responseData?.message} 👍!`, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });

      setImgIsUploaded(false);
      setIsOpen(false);
    },
  });


  function prepareFormData() {
    if (!imageInput.current?.files?.[0]) {
      return;
    }

    const formData = new FormData();
    formData.append("photo", imageInput.current.files[0]);
    return formData;
  }

  function handleImgPreview(e) {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    const path = URL.createObjectURL(file);
    setImgIsUploaded(path);
  }

  function closeImage() {
    setImgIsUploaded(false);

    if (imageInput.current) {
      imageInput.current.value = "";
    }
  }


  if (isLoading || (id && isUserDataLoading)) {
    return <Loading />;
  }

  if (isError) {
    return <ApiError error={error} />;
  }

  if (id && isUserDataError) {
    return <ApiError error={userDataError} />;
  }

  if (isProfilePostsError) {
    return <ApiError error={profilePostsError} />;
  }

  if (!profileUser) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>User not found</p>
      </div>
    );
  }



  const formattedBirthday = profileUser?.dateOfBirth
    ? new Date(profileUser.dateOfBirth).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
    : "Not available";


  return (
    <>
      <div className="facebook-profile">
        <div className="profile-shell">

          {/* Cover */}
          <div className="profile-cover ">
            <img className="w-full h-full object-cover" src={profileUser?.cover || cover} alt="" />
            {isMyProfile && <button className="cover-action">Add cover photo</button>}
          </div>

          {/* Profile Header */}
          <div className="profile-header relative ">
            <div className="avatar-block ">
              <img src={profileUser?.photo} alt={profileUser?.name} />

              {/* Camera Button */}
              {isMyProfile && (
                <div className="absolute right-2 bottom-3 z-10 translate-x-1/4 translate-y-1/4">
                  <Dropdown>
                    <DropdownTrigger>
                      <Button
                        aria-label="Change profile photo"
                        className="h-10 w-10 rounded-full bg-white dark:bg-[#1E2638] text-slate-700
                        dark:text-slate-200 border border-slate-300 dark:border-slate-700 shadow-md
                        flex items-center justify-center cursor-pointer hover:scale-105 transition"
                      >
                        <FaCamera />
                      </Button>
                    </DropdownTrigger>

                    <Dropdown.Popover>
                      <Dropdown.Menu>
                        <Dropdown.Item
                          onClick={() => setIsOpen(true)}
                          className="flex items-center"
                          id="upload-photo"
                          textValue="Upload photo"
                        >
                          <MdOutlineLinkedCamera />
                          <Label>Upload new photo</Label>
                        </Dropdown.Item>

                        <Dropdown.Item
                          onClick={() => setIsOpenn(true)}
                          className="flex items-center"
                          id="open-photo"
                          textValue="open photo"
                        >
                          <BsFillImageFill />
                          <Label>Open your photo</Label>
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown.Popover>
                  </Dropdown>
                </div>
              )}
            </div>

            {/* Upload Photo Modal */}
            {isMyProfile && (
              <Modal>
                <Button className="hidden" aria-hidden="true" />

                <Modal.Backdrop isOpen={isOpen} onOpenChange={setIsOpen}>
                  <Modal.Container>
                    <Modal.Dialog
                      className="sm:max-w-120 bg-white dark:bg-[#151B27] border border-slate-200
                      dark:border-[#232D42] text-slate-900 dark:text-slate-100 rounded-2xl p-5 shadow-2xl"
                    >
                      <Modal.CloseTrigger className="text-slate-400 hover:text-slate-700 dark:hover:text-white" />

                      <span className="mb-2 font-bold text-center text-lg block">Upload Photo</span>

                      <Modal.Header>
                        <div className="flex items-center gap-4">
                          <figure>
                            <img
                              className="w-10 h-10 rounded-full object-cover border border-purple-500/40"
                              src={profileUser?.photo}
                              alt={profileUser?.name}
                            />
                          </figure>

                          <div>
                            <h4 className="font-semibold capitalize">{profileUser?.name}</h4>
                          </div>
                        </div>
                      </Modal.Header>

                      <Modal.Body>
                        <p className="my-2 text-sm text-slate-500 dark:text-slate-400">
                          Choose an image to preview
                        </p>

                        {imgIsUploaded && (
                          <div className="relative">
                            <img
                              alt="preview"
                              className="pointer-events-none rounded-2xl object-cover select-none max-h-60
                              w-full border border-slate-200 dark:border-slate-700"
                              src={imgIsUploaded}
                            />

                            <div
                              onClick={closeImage}
                              className="absolute top-3 right-3 text-3xl text-white bg-black/60 rounded-full
                              cursor-pointer hover:bg-black/90 transition"
                            >
                              <IoIosCloseCircle />
                            </div>
                          </div>
                        )}
                      </Modal.Body>

                      <Modal.Footer className="border-t border-slate-200 dark:border-slate-800 pt-3">
                        <label className="text-3xl text-indigo-500 hover:text-indigo-600 cursor-pointer" htmlFor="postPhoto">
                          <IoMdImage />
                        </label>

                        <input
                          ref={imageInput}
                          onChange={handleImgPreview}
                          id="postPhoto"
                          type="file"
                          accept="image/*"
                          className="hidden"
                        />

                        <Button
                          onClick={uploadProfilePhoto}
                          isDisabled={!imgIsUploaded || isUploadProfilePhotoLoading}
                          className="bg-linear-to-r from-[#4F46E5] via-[#8B5CF6] to-[#EC4899] text-white
                          px-5 py-2 rounded-xl font-semibold hover:opacity-95 transition"
                          slot="close"
                        >
                          {isUploadProfilePhotoLoading ? "Uploading..." : "Upload"}
                        </Button>
                      </Modal.Footer>
                    </Modal.Dialog>
                  </Modal.Container>
                </Modal.Backdrop>
              </Modal>
            )}

            {/* Open Photo Modal */}
            <Modal>
              <Button className="hidden" aria-hidden="true" />
              <Modal.Backdrop isOpen={isOpenn} onOpenChange={setIsOpenn}>
                <Modal.Container>
                  <Modal.Dialog className="sm:max-w-120 p-0 rounded-xl overflow-hidden">
                    <Modal.CloseTrigger />
                    <img className="h-full w-full" src={profileUser?.photo} alt={profileUser?.name} />
                  </Modal.Dialog>
                </Modal.Container>
              </Modal.Backdrop>
            </Modal>

            {/* Profile Summary */}
            <div className="profile-summary">
              <div className="profile-name-row">
                <div>
                  <h1 className="profile-name capitalize">{profileUser?.name}</h1>
                  <div className="flex justify-center gap-3">
                    <Link
                      to={`/profile/${profileUser?._id || targetUserId}/followers`}
                      className="profile-subtitle hover:underline hover:text-indigo-600 dark:hover:text-indigo-400 transition cursor-pointer"
                    >
                      {profileUser?.followersCount ?? followersList.length} followers
                    </Link>
                    <p className="profile-subtitle">{profileUser?.followingCount ?? followingList.length} following</p>
                  </div>
                </div>

                <div className="profile-actions pt-2">
                  {!isMyProfile && (
                    <>
                      <button className="primary-btn">Message</button>
                      <button onClick={mutate} className="secondary-btn" disabled={isPending}>
                        {isPending
                          ? 'Updating...'
                          : followingData?.data?.data?.following
                          ? 'Unfollow'
                          : `${userData?.followers?.some((follower) => (typeof follower === 'object' ? follower?._id : follower) === data?._id) ? 'Unfollow' : 'Follow'}`}
                      </button>
                    </>
                  )}

                  {/* {isMyProfile && (
                    <>
                      <button className="primary-btn">Edit Profile</button>
                      <button className="icon-btn">•••</button>
                    </>
                  )} */}
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="profile-tabs">
            <button className="tab active">Posts</button>
            <button className="tab">About</button>
            <Link to={`/profile/${profileUser?._id || targetUserId}/followers`} className="tab flex items-center justify-center">Followers</Link>
            <Link to={`/profile/${profileUser?._id || targetUserId}/photos`} className="tab flex items-center justify-center">Photos</Link>
            <button className="tab">Videos</button>
            <button className="tab">More</button>
          </div>
        </div>

        {/* Profile Content */}
        <div className="profile-content">

          {/* Sidebar */}
          <aside className="profile-sidebar">

            {/* Intro */}
            <div className="info-card">
              <h3>Intro</h3>
              <ul>
                <li>🎂 Birthday: <span>{formattedBirthday}</span></li>
                <li>👥 Followers: <span>{profileUser?.followersCount ?? followersList.length}</span></li>
                <li>➕ Following: <span>{profileUser?.followingCount ?? followingList.length}</span></li>
                <li>
                  ⚧ Gender: <span className="capitalize">{profileUser?.gender || "Not available"}</span>
                </li>
              </ul>
            </div>

            {/* Followers */}
            <div className="info-card">
              <div className="card-header">
                <h3>Followers</h3>
                <Link
                  to={`/profile/${profileUser?._id || targetUserId}/followers`}
                  className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition"
                >
                  See all followers
                </Link>
              </div>

              {followersList.length > 0 ? (
                <div className="friends-grid">
                  {followersList.slice(0, 6).map((friend, idx) => {
                    const isObj = typeof friend === 'object' && friend !== null;
                    const friendId = isObj ? (friend._id || friend.id) : friend;
                    const friendName = isObj ? (friend.name || 'User') : 'User';
                    const friendPhoto = isObj && friend.photo ? friend.photo : defaultAvatar;

                    return (
                      <Link key={friendId || idx} to={friendId ? `/profile/${friendId}` : '#'}>
                        <div>
                          <img
                            src={friendPhoto}
                            alt={friendName}
                            onError={(e) => {
                              e.currentTarget.src = defaultAvatar;
                            }}
                          />
                          <span className="truncate">{friendName}</span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div className="w-full text-center"><span>No followers yet...😒 </span></div>
              )}

            </div>

            {/* Photos */}
            <div className="info-card">
              <div className="card-header">
                <h3>Photos</h3>
                <Link
                  to={`/profile/${profileUser?._id || targetUserId}/photos`}
                  className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition"
                >
                  See all photos
                </Link>
              </div>

              {profilePosts?.filter((post) => post.image).length > 0 ? (
                <div className="photo-grid">
                  {profilePosts
                    .filter((post) => post.image)
                    .slice(0, 6)
                    .map((post) => (
                      <img key={post._id} src={post.image} alt="photo" />
                    ))}
                </div>
              ) : (
                <div className="w-full text-center">
                  <span>No photos yet...😒 </span>
                </div>
              )}

            </div>


          </aside>

          {/* Posts */}
          <div className="flex profile-main-column flex-col gap-2">
            {isMyProfile && <PostCreation userData={data} isProfile />}

            {isProfilePostsLoading ? (
              <Loading />
            ) : (
              profilePosts?.map((post) => (
                <PostCard key={post._id} post={post} userData={profileUser} isProfile />
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
