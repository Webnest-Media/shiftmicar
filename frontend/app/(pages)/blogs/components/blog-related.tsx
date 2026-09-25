import { BlogCoverCard } from "@/app/(pages)/blogs/components/blog-cover-card";
import { TextReveal } from "@/components/animations/text-reveal";
import { Container } from "@/components/layout/container";
import { Grid, GridItem } from "@/components/layout/grid";
import { Badge } from "@/components/ui/badge";
import type { BlogPost } from "@/lib/blog-types";

type BlogRelatedProps = {
  posts: BlogPost[];
};

export function BlogRelated({ posts }: BlogRelatedProps) {
  if (posts.length === 0) return null;

  return (
    <section className="border-t border-border-muted bg-background py-section">
      <Container className="flex flex-col gap-[6.25rem] max-md:gap-12">
        <div className="flex flex-col items-start gap-5">
          <Badge>More Stories</Badge>
          <TextReveal as="h2" className="text-h1">
            Keep reading
          </TextReveal>
        </div>

        <Grid columns={12}>
          {posts.map((post, index) => (
            <GridItem key={post.id} span={12} spanMd={4}>
              <BlogCoverCard blog={post} delay={index * 0.08} />
            </GridItem>
          ))}
        </Grid>
      </Container>
    </section>
  );
}
