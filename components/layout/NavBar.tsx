"use client";
import React from "react";
import Container from "./Container";
import { Video } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth, UserButton } from "@clerk/nextjs";
import { Button } from "../ui/button";

const NavBar = () => {
  const router = useRouter();
  const { userId } = useAuth();
  return (
    <div className="sticky top-0 border border-b-primary/10">
      <Container>
        <div className="flex justify-between items-center">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => router.push("/")}
          >
            <Video className="w-8 h-8" /> {/* Proportional size for the icon */}
            <div className="font-bold text-2xl">VidChat</div>{" "}
            {/* Matches larger font for branding */}
          </div>
          <div className="flex gap-3 items-center">
            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox: "w-10 h-10", // Increase avatar size
                  userButtonText: "text-lg font-semibold", // Increase font size and weight
                },
              }}
            />
            {!userId && (
              <>
                <Button
                  onClick={() => router.push("/sign-in")}
                  size="sm"
                  variant="outline"
                  className="px-5 py-1.5 text-base"
                >
                  Sign in
                </Button>
                <Button
                  onClick={() => router.push("/sign-up")}
                  size="sm"
                  className="px-5 py-1.5 text-base"
                >
                  Sign up
                </Button>
              </>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default NavBar;
