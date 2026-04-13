import { useState, useEffect } from "react";
import Header from "../components/header/header";
import LinkList from "../components/link/link";
import Footer from "../components/footer/footer";
import pb from "../hooks/usePocketBase";

const DEFAULT_PROFILE = {
  userName: "Your Name",
  photoLink: "",
  desc: "",
  about: "",
  socialLinks: [],
};

const Home = () => {
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      pb.collection("profile").getFirstListItem("").catch(() => null),
      pb.collection("links").getFullList({ sort: "sort_order,created", filter: "enabled=true" }).catch(() => []),
    ]).then(([profileRecord, linkRecords]) => {
      if (profileRecord) setProfile(profileRecord);
      setLinks(linkRecords);
      setLoading(false);
    });
  }, []);

  if (loading) return null;

  return (
    <>
      <Header profile={profile} />
      <LinkList links={links} />
      <Footer socialLinks={profile.socialLinks || []} />
    </>
  );
};

export default Home;
