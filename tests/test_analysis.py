import unittest
from src.parser import load_transcripts_from_dir, load_interview_guide
from src.validation import validate_quote
from src.retrieval import retrieve_relevant_segments


class TestRoboticSurgeryAnalysis(unittest.TestCase):
    def test_transcript_parsing(self):
        transcripts = load_transcripts_from_dir("data")
        self.assertEqual(len(transcripts), 3)

        experts = {t.expert for t in transcripts}
        self.assertIn("Dr. Jean Martin", experts)
        self.assertIn("Anna Keller", experts)
        self.assertIn("Dr. Emily Carter", experts)

        # Check markets
        markets = {t.market for t in transcripts}
        self.assertIn("France", markets)
        self.assertIn("Germany", markets)
        self.assertIn("United Kingdom", markets)

        # Check segment counts
        for t in transcripts:
            self.assertGreaterEqual(len(t.segments), 10)
            for seg in t.segments:
                self.assertTrue(seg.timestamp)
                self.assertTrue(seg.speaker)
                self.assertTrue(seg.text)

    def test_interview_guide_loading(self):
        questions = load_interview_guide("data/interview_guide.txt")
        self.assertEqual(len(questions), 6)
        self.assertTrue("barriers" in questions[1].lower())
        self.assertTrue("budgets" in questions[2].lower() or "roi" in questions[2].lower())

    def test_retrieval_relevance_for_barriers(self):
        transcripts = load_transcripts_from_dir("data")
        all_segments = [s for t in transcripts for s in t.segments]

        results = retrieve_relevant_segments("What are the main barriers to adoption?", all_segments, top_k=6)
        self.assertGreater(len(results), 0)

        timestamps = {r[0].timestamp for r in results}
        # Barrier answers are at France 01:20, Germany 01:10, UK 01:05
        has_barrier_timestamp = any(ts in timestamps for ts in ["01:20", "01:10", "01:05"])
        self.assertTrue(has_barrier_timestamp)

    def test_quote_validation_exact(self):
        transcripts = load_transcripts_from_dir("data")
        all_segments = [s for t in transcripts for s in t.segments]

        exact_quote = "The biggest issue is still capital budget approval. Hospitals may like the technology clinically, but purchasing committees need a strong economic case before approving a system."
        val = validate_quote(exact_quote, "01:20", "Dr. Jean Martin", all_segments)
        self.assertTrue(val.is_validated)
        self.assertEqual(val.validation_status, "verified")
        self.assertEqual(val.timestamp, "01:20")
        self.assertEqual(val.expert, "Dr. Jean Martin")

    def test_quote_validation_hallucination_detection(self):
        transcripts = load_transcripts_from_dir("data")
        all_segments = [s for t in transcripts for s in t.segments]

        fake_quote = "Robotic surgery has reached 80% penetration across all French hospitals due to subsidized government grants."
        val = validate_quote(fake_quote, "01:20", "Dr. Jean Martin", all_segments)
        self.assertFalse(val.is_validated)
        self.assertEqual(val.validation_status, "unverified")
        self.assertIn("could not be validated", val.warning_message.lower())


if __name__ == "__main__":
    unittest.main()
