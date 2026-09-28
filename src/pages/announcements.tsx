import Layout from '@theme/Layout';
import Announcement from '../components/Announcement';
import ReleaseNotes from '../components/ReleaseNotes';
import SiteFooter from '../components/SiteFooter';

export default function AnnouncementsPage() {
  return (
    <Layout title="公告" description="Cyrene 的版本公告与项目动态。">
      <main>
        <Announcement />
        <ReleaseNotes />
      </main>
      <SiteFooter />
    </Layout>
  );
}
